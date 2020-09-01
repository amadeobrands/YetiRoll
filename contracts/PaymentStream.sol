// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./lib/Types.sol";
import "./Sablier.sol";

contract PaymentStream is Sablier {

    modifier baseStreamRequirements(address recipient, uint deposit, uint startTime) {
        require(recipient != address(0x00), "stream to the zero address");
        require(recipient != address(this), "stream to the contract itself");
        require(recipient != msg.sender, "stream to the caller");
        require(deposit > 0, "deposit is zero");
        require(startTime >= block.timestamp, "start time before block.timestamp");
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

    using SafeMath for uint;

    mapping(uint256 => Types.PausableStream) private pausableStreams;


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


    function createStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _startTime,
        uint256 _stopTime
    ) public override
    baseStreamRequirements(_recipient, _deposit, _startTime)
    returns (uint256 streamId) {
        require(isNonZeroLengthStream(_startTime, _stopTime), "Stream must last a least a second");

        uint streamId = super.createStream(
            _recipient,
            _deposit,
            _tokenAddress,
            _startTime,
            _stopTime
        );

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
