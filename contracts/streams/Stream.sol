// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./lib/Types.sol";
import "./interface/IStream.sol";

contract Stream is IStream, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant STREAM_ADMIN = keccak256("STREAM_ADMIN");
    bytes32 public constant STREAM_OPERATOR = keccak256("STREAM_OPERATOR");

    mapping(uint256 => Types.Stream) internal streams;
    uint256 public nextStreamId;

    event StreamCreated(
        uint256 _streamId,
        address _token,
        address _sender,
        address _recipient,
        uint256 _deposit,
        uint256 _startTime,
        uint256 _stopTime
    );

    event StreamWithdrawnFrom(
        uint256 _streamId,
        address _token,
        address _recipient,
        uint256 _amount,
        uint256 _amountRemaining,
        uint256 _timeOfWithdrawal
    );

    event StreamClosed(
        uint256 _streamId,
        address _recipient,
        uint256 _amount,
        uint256 _amountRemaining,
        uint256 _timeOfWithdrawal
    );

    // @dev construct Stream and set Admin to creator
    constructor() public {
        _setupRole(STREAM_ADMIN, msg.sender);
        _setRoleAdmin(STREAM_OPERATOR, STREAM_ADMIN);
        nextStreamId = 1;
    }

    // @dev set address as treasury operator, likely to be a stream manager but perhaps different use cases later on
    function setStreamOperator(address _who) public onlyStreamAdmin {
        grantRole(STREAM_OPERATOR, _who);
    }

    function createStream(
        address _sender,
        address _recipient,
        uint256 _deposit,
        address _token,
        uint256 _startTime,
        uint256 _stopTime
    )
        public
        virtual
        onlyStreamOperator
        _baseStreamRequirements(_recipient, _deposit, _startTime)
        returns (uint256)
    {
        require(
            _isNonZeroLengthStream(_startTime, _stopTime),
            "Stream must last a least a second"
        );

        uint256 duration = _stopTime.sub(_startTime);
        uint256 ratePerSecond = _calculateRatePerSecond(_deposit, duration);
        require(ratePerSecond > 0, "Rate per second must be above 0");

        uint256 streamId = nextStreamId;
        nextStreamId = nextStreamId.add(1);

        streams[streamId] = Types.Stream({
            remainingBalance: _deposit,
            deposit: _deposit,
            ratePerSecond: ratePerSecond,
            recipient: _recipient,
            sender: _sender,
            startTime: _startTime,
            stopTime: _stopTime,
            tokenAddress: _token,
            isEntity: true,
            streamType: Types.StreamType.FixedTimeStream
        });

        emit StreamCreated(
            streamId,
            _token,
            _sender,
            _recipient,
            _deposit,
            _startTime,
            _stopTime
        );

        return streamId;
    }

    function withdraw(
        uint256 _streamId,
        uint256 _amount,
        address _recipient
    ) public onlyStreamOperator _canWithdrawFunds(_streamId, _amount, _recipient) {
        streams[_streamId].remainingBalance = streams[_streamId]
            .remainingBalance
            .sub(_amount);

        emit StreamWithdrawnFrom(
            _streamId,
            streams[_streamId].tokenAddress,
            _recipient,
            _amount,
            streams[_streamId].remainingBalance,
            block.timestamp
        );
    }

    function getStream(uint256 _streamId)
        external
        view
        _streamExists(_streamId)
        returns (
            address sender,
            address recipient,
            uint256 deposit,
            address tokenAddress,
            uint256 startTime,
            uint256 stopTime,
            uint256 remainingBalance,
            uint256 ratePerSecond,
            uint256 balanceAccrued
        )
    {
        sender = streams[_streamId].sender;
        recipient = streams[_streamId].recipient;
        deposit = streams[_streamId].deposit;
        tokenAddress = streams[_streamId].tokenAddress;
        startTime = streams[_streamId].startTime;
        stopTime = streams[_streamId].stopTime;
        remainingBalance = streams[_streamId].remainingBalance;
        ratePerSecond = streams[_streamId].ratePerSecond;
        balanceAccrued = _calculateBalanceAccrued(_streamId);
    }

    function getStreamTokenAddress(uint256 _streamId)
        public
        view
        returns (address token)
    {
        return streams[_streamId].tokenAddress;
    }

    function _calculateBalanceAccrued(uint256 _streamId)
        internal
        view
        returns (uint256 balanceAccrued)
    {
        return
            _calculateDurationElapsed(_streamId).mul(
                streams[_streamId].ratePerSecond
            );
    }

    function _calculateBalanceRemaining(uint256 _streamId)
        internal
        view
        returns (uint256 BalanceRemaining)
    {
        return
            streams[_streamId].deposit.sub(_calculateBalanceAccrued(_streamId));
    }

    function _isStreamRunning(uint256 _streamId) internal view returns (bool) {
        return _hasStreamStarted(_streamId) && !_hasStreamFinished(_streamId);
    }

    function _hasStreamStarted(uint256 _streamId)
        internal
        virtual
        view
        returns (bool)
    {
        return block.timestamp >= streams[_streamId].startTime;
    }

    function _hasStreamFinished(uint256 _streamId)
        internal
        virtual
        view
        returns (bool)
    {
        return block.timestamp >= streams[_streamId].stopTime;
    }

    function _calculateRatePerSecond(uint256 _deposit, uint256 _duration)
        internal
        virtual
        view
        returns (uint256)
    {
        return _deposit.div(_duration);
    }

    function _isNonZeroLengthStream(uint256 _startTime, uint256 _stopTime)
        internal
        view
        returns (bool)
    {
        return _stopTime.sub(_startTime) > 0;
    }

    function _calculateDurationElapsed(uint256 _streamId)
        internal
        virtual
        view
        returns (uint256 durationElapsed)
    {
        if (_isStreamRunning(_streamId)) {
            return block.timestamp.sub(streams[_streamId].startTime);
        } else if (_hasStreamFinished(_streamId)) {
            return
                streams[_streamId].stopTime.sub(streams[_streamId].startTime);
        }

        return 0;
    }

    function _calculateDurationRemaining(uint256 _streamId)
        internal
        virtual
        view
        returns (uint256 durationElapsed)
    {
        if (_calculateDurationElapsed(_streamId) > 0) {
            return streams[_streamId].stopTime.sub(block.timestamp);
        }
        return 0;
    }

    modifier _streamExists(uint256 _streamId) {
        require(streams[_streamId].isEntity, "Stream does not exist");
        _;
    }

    modifier _canWithdrawFunds(
        uint256 _streamId,
        uint256 _amount,
        address _who
    ) virtual {
        require(streams[_streamId].recipient == _who, "Not the stream owner");
        require(
            streams[_streamId].remainingBalance >= _amount,
            "Not enough balance to withdraw"
        );
        _;
    }

    // @dev check if the address has the role Treasury Admin
    modifier onlyStreamAdmin() {
        require(hasRole(STREAM_ADMIN, msg.sender), "Not Stream Admin");
        _;
    }

    // @dev check if the address has the role Treasury Operator
    modifier onlyStreamOperator() {
        require(hasRole(STREAM_OPERATOR, msg.sender), "Not Stream Operator");
        _;
    }
}
