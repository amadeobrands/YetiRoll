// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./lib/Types.sol";
import "./Stream.sol";
import "./interface/IPausableStream.sol";

contract PausableStream is IPausableStream, Stream {
    using SafeMath for uint256;

    mapping(uint256 => Types.PausableStream) private pausableStreams;

    // todo toggle if stream starts active or not
    // todo add test case for multiple streams being created
    function createStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _duration,
        uint256 _startTime
    )
        public
        override
        _baseStreamRequirements(_recipient, _deposit, _startTime)
        returns (uint256 _streamId)
    {
        uint256 streamId = nextStreamId;
        nextStreamId = nextStreamId.add(1);

        uint256 ratePerSecond = _calculateRatePerSecond(_deposit, _duration);

        if (ratePerSecond == 0) {
            revert("Rate per second is less than 1");
        }

        uint256 stopTime = _startTime.add(_duration);

        streams[streamId] = Types.Stream({
            remainingBalance: _deposit,
            deposit: _deposit,
            ratePerSecond: ratePerSecond,
            recipient: _recipient,
            sender: msg.sender,
            startTime: _startTime,
            stopTime: _startTime.add(_duration),
            tokenAddress: _tokenAddress,
            isEntity: true,
            streamType: Types.StreamType.PausableStream
        });

        emit PausableStreamCreated(
            streamId,
            _startTime,
            _deposit,
            _duration,
            ratePerSecond,
            true
        );

        pausableStreams[streamId] = Types.PausableStream({
            duration: _duration,
            durationElapsed: 0,
            isActive: true
        });

        return streamId;
    }

    function pauseStream(uint256 _streamId) public _streamIsActive(_streamId) {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        if (_hasStreamFinished(_streamId)) {
            revert("Stream has finished");
        }

        pausableStreams[_streamId].durationElapsed = _calculateDurationElapsed(
            _streamId
        );

        // Reset start and stop points
        streams[_streamId].startTime = 0;
        streams[_streamId].stopTime = 0;

        // Pause the stream
        pausableStreams[_streamId].isActive = false;
    }

    function startStream(uint256 _streamId) public _streamIsPaused(_streamId) {
        if (
            _calculateDurationElapsed(_streamId) ==
            pausableStreams[_streamId].duration
        ) {
            revert("Stream has finished");
        }

        uint256 durationRemaining = pausableStreams[_streamId].duration.sub(
            pausableStreams[_streamId].durationElapsed
        );

        // Initiate start and end points
        streams[_streamId].startTime = block.timestamp;
        streams[_streamId].stopTime = block.timestamp.add(durationRemaining);

        // Activate the stream
        pausableStreams[_streamId].isActive = true;
    }

    function getPausableStream(uint256 _streamId)
        external
        view
        returns (
            uint256 duration,
            uint256 durationElapsed,
            uint256 durationRemaining,
            bool isRunning
        )
    {
        return (
            pausableStreams[_streamId].duration,
            _calculateDurationElapsed(_streamId),
            _calculateDurationRemaining(_streamId),
            _isStreamRunning(_streamId)
        );
    }

    modifier _streamIsActive(uint256 _streamId) {
        require(_isStreamActive(_streamId), "Stream is not running");
        _;
    }

    modifier _streamIsPaused(uint256 _streamId) {
        require(false == _isStreamActive(_streamId), "Stream is running");
        _;
    }

    modifier _canWithdrawFunds(
        uint256 _streamId,
        uint256 _amount,
        address _who
    ) override {
        require(streams[_streamId].recipient == _who, "Not the stream owner");
        require(
            _calculateBalanceAccrued(_streamId) >= _amount,
            "Trying to withdraw more than balance accrued"
        );
        _;
    }

    function _calculateDurationElapsed(uint256 _streamId)
        internal
        override
        view
        returns (uint256 durationElapsed)
    {
        if (_isStreamRunning(_streamId)) {
            uint256 runTime = block.timestamp.sub(streams[_streamId].startTime);
            return runTime.add(pausableStreams[_streamId].durationElapsed);
        } else if (_hasStreamFinished(_streamId)) {
            return pausableStreams[_streamId].duration;
        }

        return pausableStreams[_streamId].durationElapsed;
    }

    function _calculateDurationRemaining(uint256 _streamId)
        internal
        override
        view
        returns (uint256 durationElapsed)
    {
        return
            pausableStreams[_streamId].duration.sub(
                _calculateDurationElapsed(_streamId)
            );
    }

    function _isStreamActive(uint256 _streamId) internal view returns (bool) {
        return pausableStreams[_streamId].isActive;
    }

    function _hasStreamStarted(uint256 _streamId)
        internal
        override
        view
        returns (bool)
    {
        return
            _isStreamActive(_streamId) &&
            block.timestamp >= streams[_streamId].startTime;
    }

    function _hasStreamFinished(uint256 _streamId)
        internal
        override
        view
        returns (bool)
    {
        return
            _isStreamActive(_streamId) &&
            block.timestamp >= streams[_streamId].stopTime;
    }
}
