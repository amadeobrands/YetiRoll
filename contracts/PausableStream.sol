pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./lib/Types.sol";
import "./Stream.sol";
import "./interface/IPausableStream.sol";

contract PausableStream is IPausableStream, Stream {
    using SafeMath for uint256;

    mapping(uint256 => Types.PausableStream) private pausableStreams;

    // todo toggle if stream starts active or not
    // todo only Stream Manager
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
        payable
        _baseStreamRequirements(_recipient, _deposit, _startTime)
        returns (uint256 _streamId)
    {
        uint256 streamId = nextStreamId;
        nextStreamId = nextStreamId.add(1);
        // todo ensure over 0
        uint256 ratePerSecond = _ratePerSecond(_deposit, _duration);
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

    // todo make generic and override see _canWithdrawFunds
    function canWithdrawFunds(
        uint256 _streamId,
        uint256 _amount,
        address _who
    ) public returns (bool) {
        return (_who == streams[_streamId].recipient &&
            _calculateBalanceAccrued(_streamId) >= _amount);
    }

    function pauseStream(uint256 _streamId) public _streamIsActive(_streamId) {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        if (_hasStreamFinished(_streamId)) {
            revert("Stream has finished");
        }

        if (_hasStreamStarted(_streamId)) {
            // add any previous time accrued to the total duration of the stream
            pausableStream.durationElapsed = _calculateDurationElapsed(
                _streamId
            );
        }

        // Reset start and stop points
        stream.startTime = 0;
        stream.stopTime = 0;

        // Pause the stream
        pausableStreams[_streamId].isActive = false;
    }

    function startStream(uint256 _streamId) public _streamIsPaused(_streamId) {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        // Need a way to calculate the duration elapsed on the fly here
        if (_calculateDurationElapsed(_streamId) == pausableStream.duration) {
            revert("Stream has finished");
        }

        uint256 durationRemaining = pausableStream.duration.sub(
            pausableStream.durationElapsed
        );

        // Initiate start and end points
        stream.startTime = block.timestamp;
        stream.stopTime = block.timestamp.add(durationRemaining);

        // Activate the stream
        pausableStreams[_streamId].isActive = true;
    }

    //  __      ___
    //  \ \    / (_)
    //   \ \  / / _  _____      __
    //    \ \/ / | |/ _ \ \ /\ / /
    //     \  /  | |  __/\ V  V /
    //      \/   |_|\___| \_/\_/

    function getPausableStream(uint256 _streamId)
        external
        view
        returns (
            uint256 duration,
            uint256 durationElapsed,
            uint256 durationRemaining,
            bool isActive,
            uint256 deposit,
            uint256 balanceAccrued,
            uint256 startTime
        )
    {
        return (
            pausableStreams[_streamId].duration,
            _calculateDurationElapsed(_streamId),
            _calculateDurationRemaining(_streamId),
            pausableStreams[_streamId].isActive,
            streams[_streamId].deposit,
            _calculateBalanceAccrued(_streamId),
            streams[_streamId].startTime
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

    //  _____       _                        _  __      ___
    // |_   _|     | |                      | | \ \    / (_)
    //   | |  _ __ | |_ ___ _ __ _ __   __ _| |  \ \  / / _  _____      _____
    //   | | | '_ \| __/ _ \ '__| '_ \ / _` | |   \ \/ / | |/ _ \ \ /\ / / __|
    //  _| |_| | | | ||  __/ |  | | | | (_| | |    \  /  | |  __/\ V  V /\__ \
    // |_____|_| |_|\__\___|_|  |_| |_|\__,_|_|     \/   |_|\___| \_/\_/ |___/
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

    function calculateDurationElapsed(uint256 _streamId)
        external
        view
        returns (
            uint256 durationElapsed,
            bool isRunning,
            uint256 startTime,
            uint256 endTime,
            uint256 ratePerSecond
        )
    {
        return (
            _calculateDurationElapsed(_streamId),
            _isStreamRunning(_streamId),
            streams[_streamId].startTime,
            streams[_streamId].stopTime,
            streams[_streamId].ratePerSecond
        );
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
            //            _isStreamActive(_streamId) &&
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
