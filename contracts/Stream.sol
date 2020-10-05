pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/Erc20/IErc20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./lib/Types.sol";
import "./interface/IStream.sol";

contract Stream is IStream, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant STREAM_CONTROLLER = keccak256("STREAM_CONTROLLER");
    bytes32 public constant STREAM_MANAGER = keccak256("STREAM_MANAGER");

    mapping(uint256 => Types.Stream) internal streams;
    uint256 public nextStreamId;

    constructor() public {
        nextStreamId = 1;
        _setRoleAdmin(STREAM_MANAGER, STREAM_CONTROLLER);
        _setupRole(STREAM_CONTROLLER, msg.sender);
        _setupRole(STREAM_MANAGER, msg.sender);
    }

    function grantStreamManager(address _streamManager)
        public
        _onlyStreamController
    {
        grantRole(STREAM_MANAGER, _streamManager);
    }

    function createStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _startTime,
        uint256 _stopTime
    )
        public
        virtual
        payable
        _onlyStreamManager
        _baseStreamRequirements(_recipient, _deposit, _startTime)
        returns (uint256)
    {
        require(
            _isNonZeroLengthStream(_startTime, _stopTime),
            "Stream must last a least a second"
        );

        uint256 duration = _stopTime.sub(_startTime);
        uint256 ratePerSecond = _ratePerSecond(_deposit, duration);
        require(ratePerSecond > 0, "Rate per second must be above 0");

        uint256 streamId = nextStreamId;
        nextStreamId = nextStreamId.add(1);

        streams[streamId] = Types.Stream({
            remainingBalance: _deposit,
            deposit: _deposit,
            ratePerSecond: ratePerSecond,
            recipient: _recipient,
            sender: msg.sender,
            startTime: _startTime,
            stopTime: _stopTime,
            tokenAddress: _tokenAddress,
            isEntity: true,
            streamType: Types.StreamType.FixedTimeStream
        });

        return streamId;
    }

    function withdraw(
        uint256 _streamId,
        uint256 _amount,
        address _who
    ) public _onlyStreamManager _canWithdrawFunds(_streamId, _amount, _who) {
        streams[_streamId].remainingBalance = streams[_streamId]
            .remainingBalance
            .sub(_amount);
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
            uint256 ratePerSecond
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
    }

    function getStreamTokenAddress(uint256 _streamId)
        public
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

    function _ratePerSecond(uint256 _deposit, uint256 _duration)
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

    modifier _onlyStreamManager() {
        require(hasRole(STREAM_MANAGER, msg.sender), "Not the Stream Manager");
        _;
    }
    modifier _onlyStreamController() {
        require(
            hasRole(STREAM_CONTROLLER, msg.sender),
            "Not the Stream Controller"
        );
        _;
    }

    modifier _canWithdrawFunds(
        uint256 _streamId,
        uint256 _amount,
        address _who
    ) virtual {
        require(_who == streams[_streamId].recipient, "Not the stream owner");
        require(
            streams[_streamId].remainingBalance >= _amount,
            "Not enough balance to withdraw"
        );
        _;
    }
}
