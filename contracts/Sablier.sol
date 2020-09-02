// SPDX-License-Identifier:

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./compound/Exponential.sol";
import "./interface/IERC1620.sol";
import "./lib/Types.sol";

/**
 * @title Sablier's Money Streaming
 * @author Sablier
 */
contract Sablier is IERC1620, Exponential, ReentrancyGuard {
    /*** Storage Properties ***/

    /**
     * @notice The amount of interest has been accrued per token address.
     */
    mapping(address => uint256) private earnings;

    /**
     * @notice The percentage fee charged by the contract on the accrued interest.
     */
    Exp public fee;

    /**
     * @notice Counter for new stream ids.
     */
    uint256 public nextStreamId;

    /**
     * @notice The stream objects identifiable by their unsigned integer ids.
     */
    mapping(uint256 => Types.Stream) private streams;

    /*** Modifiers ***/

    /**
     * @dev Throws if the caller is not the sender of the recipient of the stream.
     */
    modifier onlySenderOrRecipient(uint256 streamId) {
        require(
            msg.sender == streams[streamId].sender ||
                msg.sender == streams[streamId].recipient,
            "caller is not the sender or the recipient of the stream"
        );
        _;
    }

    /**
     * @dev Throws if the provided id does not point to a valid stream.
     */
    modifier streamExists(uint256 streamId) {
        require(streams[streamId].isEntity, "stream does not exist");
        _;
    }

    /*** Contract Logic Starts Here */

    constructor() public {
        nextStreamId = 1;
    }

    /*** View Functions ***/

    function getStream(uint256 streamId)
        external
        override
        view
        streamExists(streamId)
        returns (
            address sender,
            address recipient,
            uint256 deposit,
            address tokenAddress,
            uint256 startTime,
            uint256 stopTime,
            uint256 remainingBalance,
            uint256 ratePerSecond
        )
    {
        sender = streams[streamId].sender;
        recipient = streams[streamId].recipient;
        deposit = streams[streamId].deposit;
        tokenAddress = streams[streamId].tokenAddress;
        startTime = streams[streamId].startTime;
        stopTime = streams[streamId].stopTime;
        remainingBalance = streams[streamId].remainingBalance;
        ratePerSecond = streams[streamId].ratePerSecond;
    }

    function deltaOf(uint256 streamId)
        public
        view
        streamExists(streamId)
        returns (uint256 delta)
    {
        Types.Stream memory stream = streams[streamId];
        if (block.timestamp <= stream.startTime) return 0;
        if (block.timestamp < stream.stopTime)
            return block.timestamp - stream.startTime;
        return stream.stopTime - stream.startTime;
    }

    struct BalanceOfLocalVars {
        MathError mathErr;
        uint256 recipientBalance;
        uint256 withdrawalAmount;
        uint256 senderBalance;
    }

    function balanceOf(uint256 streamId, address who)
        public
        override
        view
        streamExists(streamId)
        returns (uint256 balance)
    {
        Types.Stream memory stream = streams[streamId];
        BalanceOfLocalVars memory vars;

        uint256 delta = deltaOf(streamId);
        (vars.mathErr, vars.recipientBalance) = mulUInt(
            delta,
            stream.ratePerSecond
        );
        require(
            vars.mathErr == MathError.NO_ERROR,
            "recipient balance calculation error"
        );

        /*
         * If the stream `balance` does not equal `deposit`, it means there have been withdrawals.
         * We have to subtract the total amount withdrawn from the amount of money that has been
         * streamed until now.
         */
        if (stream.deposit > stream.remainingBalance) {
            (vars.mathErr, vars.withdrawalAmount) = subUInt(
                stream.deposit,
                stream.remainingBalance
            );
            assert(vars.mathErr == MathError.NO_ERROR);
            (vars.mathErr, vars.recipientBalance) = subUInt(
                vars.recipientBalance,
                vars.withdrawalAmount
            );
            /* `withdrawalAmount` cannot and should not be bigger than `recipientBalance`. */
            assert(vars.mathErr == MathError.NO_ERROR);
        }

        if (who == stream.recipient) return vars.recipientBalance;
        if (who == stream.sender) {
            (vars.mathErr, vars.senderBalance) = subUInt(
                stream.remainingBalance,
                vars.recipientBalance
            );
            /* `recipientBalance` cannot and should not be bigger than `remainingBalance`. */
            assert(vars.mathErr == MathError.NO_ERROR);
            return vars.senderBalance;
        }
        return 0;
    }

    /*** Public Effects & Interactions Functions ***/

    struct CreateStreamLocalVars {
        MathError mathErr;
        uint256 duration;
        uint256 ratePerSecond;
    }

    function createStream(
        address recipient,
        uint256 deposit,
        address tokenAddress,
        uint256 startTime,
        uint256 stopTime
    ) public virtual override returns (uint256) {
        require(recipient != address(0x00), "stream to the zero address");
        require(recipient != address(this), "stream to the contract itself");
        require(recipient != msg.sender, "stream to the caller");
        require(deposit > 0, "deposit is zero");
        require(
            startTime >= block.timestamp,
            "start time before block.timestamp"
        );
        require(stopTime > startTime, "stop time before the start time");

        CreateStreamLocalVars memory vars;
        (vars.mathErr, vars.duration) = subUInt(stopTime, startTime);
        /* `subUInt` can only return MathError.INTEGER_UNDERFLOW but we know `stopTime` is higher than `startTime`. */
        assert(vars.mathErr == MathError.NO_ERROR);

        /* Without this, the rate per second would be zero. */
        require(deposit >= vars.duration, "deposit smaller than time delta");

        /* This condition avoids dealing with remainders */
        require(
            deposit % vars.duration == 0,
            "deposit not multiple of time delta"
        );

        (vars.mathErr, vars.ratePerSecond) = divUInt(deposit, vars.duration);
        /* `divUInt` can only return MathError.DIVISION_BY_ZERO but we know `duration` is not zero. */
        assert(vars.mathErr == MathError.NO_ERROR);

        /* Create and store the stream object. */
        uint256 streamId = nextStreamId;
        streams[streamId] = Types.Stream({
            remainingBalance: deposit,
            deposit: deposit,
            isEntity: true,
            ratePerSecond: vars.ratePerSecond,
            recipient: recipient,
            sender: msg.sender,
            startTime: startTime,
            stopTime: stopTime,
            tokenAddress: tokenAddress,
            streamType: Types.StreamType.PausableStream
        });

        /* Increment the next stream id. */
        (vars.mathErr, nextStreamId) = addUInt(nextStreamId, uint256(1));
        require(
            vars.mathErr == MathError.NO_ERROR,
            "next stream id calculation error"
        );
        require(
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                deposit
            ),
            "token transfer failure"
        );
        emit CreateStream(
            streamId,
            msg.sender,
            recipient,
            deposit,
            tokenAddress,
            startTime,
            stopTime
        );
        return streamId;
    }

    struct WithdrawFromStreamLocalVars {
        MathError mathErr;
    }

    function withdrawFromStream(uint256 streamId, uint256 amount)
        external
        override
        nonReentrant
        streamExists(streamId)
        onlySenderOrRecipient(streamId)
        returns (bool)
    {
        require(amount > 0, "amount is zero");
        Types.Stream memory stream = streams[streamId];
        WithdrawFromStreamLocalVars memory vars;

        uint256 balance = balanceOf(streamId, stream.recipient);
        require(balance >= amount, "amount exceeds the available balance");

        (vars.mathErr, streams[streamId].remainingBalance) = subUInt(
            stream.remainingBalance,
            amount
        );
        /**
         * `subUInt` can only return MathError.INTEGER_UNDERFLOW but we know that `remainingBalance` is at least
         * as big as `amount`.
         */
        assert(vars.mathErr == MathError.NO_ERROR);

        if (streams[streamId].remainingBalance == 0) delete streams[streamId];

        require(
            IERC20(stream.tokenAddress).transfer(stream.recipient, amount),
            "token transfer failure"
        );
        emit WithdrawFromStream(streamId, stream.recipient, amount);

        return true;
    }

    function cancelStream(uint256 streamId)
        external
        override
        nonReentrant
        streamExists(streamId)
        onlySenderOrRecipient(streamId)
        returns (bool)
    {
        Types.Stream memory stream = streams[streamId];
        uint256 senderBalance = balanceOf(streamId, stream.sender);
        uint256 recipientBalance = balanceOf(streamId, stream.recipient);

        delete streams[streamId];

        IERC20 token = IERC20(stream.tokenAddress);
        if (recipientBalance > 0)
            require(
                token.transfer(stream.recipient, recipientBalance),
                "recipient token transfer failure"
            );
        if (senderBalance > 0)
            require(
                token.transfer(stream.sender, senderBalance),
                "sender token transfer failure"
            );

        emit CancelStream(
            streamId,
            stream.sender,
            stream.recipient,
            senderBalance,
            recipientBalance
        );

        return true;
    }
}
