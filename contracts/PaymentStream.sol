// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./lib/Types.sol";
import "./Sablier.sol";

contract PaymentStream {
    using SafeMath for uint;

    modifier baseStreamRequirements(address recipient, uint deposit, uint startTime) {
        require(recipient != address(0x00), "stream to the zero address");
        require(recipient != address(this), "stream to the contract itself");
        require(recipient != msg.sender, "stream to the caller");
        require(deposit > 0, "deposit is zero");
        require(startTime >= block.timestamp, "start time before block.timestamp");
        _;
    }

    modifier streamExists(uint256 streamId) {
        require(streams[streamId].isEntity, "Stream does not exist");
        _;
    }

    event PausableStreamCreated(
        uint id,
        uint startTime,
        uint deposit,
        uint duration,
        uint ratePerSecond,
        bool isActive
    );


    mapping(uint256 => Types.Stream) private streams;
    mapping(uint256 => Types.PausableStream) private pausableStreams;
    uint256 public nextStreamId;

    constructor() public {
        nextStreamId = 1;
    }


    //           _____      _   _
    //          / ____|    | | | |
    //         | |  __  ___| |_| |_ ___ _ __ ___
    //         | | |_ |/ _ \ __| __/ _ \ '__/ __|
    //         | |__| |  __/ |_| ||  __/ |  \__ \
    //          \_____|\___|\__|\__\___|_|  |___/
    //
    function getPausableStream(
        uint _streamId
    ) external view returns (
        uint256 duration,
        uint256 durationElapsed,
        uint256 durationRemaining,
        bool isActive
    ) {
        Types.PausableStream memory stream = pausableStreams[_streamId];

        return (
        stream.duration,
        stream.durationElapsed,
        stream.duration.sub(stream.durationElapsed),
        stream.isActive
        );
    }

    function getStream(uint256 streamId)
    external
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


    function createStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _startTime,
        uint256 _stopTime
    ) public
    baseStreamRequirements(_recipient, _deposit, _startTime)
    returns (uint256 streamId) {
        require(isNonZeroLengthStream(_startTime, _stopTime), "Stream must last a least a second");

        uint duration = _stopTime.sub(_startTime);
        uint ratePerSecond = _ratePerSecond(_deposit, duration);
        require(ratePerSecond > 0, "Rate per second is under 0");

        uint256 streamId = nextStreamId;
        streams[streamId] = Types.Stream({
        remainingBalance : _deposit,
        deposit : _deposit,
        isEntity : true,
        ratePerSecond : ratePerSecond,
        recipient : _recipient,
        sender : msg.sender,
        startTime : _startTime,
        stopTime : _stopTime,
        tokenAddress : _tokenAddress
        });

        return streamId;
    }

    function createPausableStream(
        address _recipient,
        uint _deposit,
        address _ercTokenAddress,
        uint _duration,
        uint _startTime
    ) public payable
    baseStreamRequirements(_recipient, _deposit, _startTime)
    returns (uint _streamId){
        uint streamId = nextStreamId;
        uint ratePerSecond = _ratePerSecond(_deposit, _duration);
        uint stopTime = _startTime.add(_duration);

        emit PausableStreamCreated(
            streamId,
            _startTime,
            _deposit,
            _duration,
            ratePerSecond,
            true
        );

        pausableStreams[streamId] = Types.PausableStream({
        duration : _duration,
        durationElapsed : 0,
        isActive : true
        });

        return streamId;
    }

    function _ratePerSecond(uint _deposit, uint _duration) internal view returns (uint) {
        return _deposit.div(_duration);
    }

    function isNonZeroLengthStream(uint _startTime, uint _stopTime) internal view returns (bool) {
        return _stopTime.sub(_startTime) > 0;
    }
}
