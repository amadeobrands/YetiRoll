pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./lib/Types.sol";
import "./Stream.sol";

contract PausableStream is Stream {
    using SafeMath for uint256;

    mapping(uint256 => Types.PausableStream) private pausableStreams;

    // todo toggle if stream starts active or not
    // todo only Stream Manager
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

    function pauseStream(uint256 _streamId)
        public
        _streamIsPausable(_streamId)
        _streamIsActive(_streamId)
    {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        if (_hasStreamStopped(_streamId)) {
            revert("Stream has finished");
        }

        if (_hasStreamStarted(_streamId)) {
            uint256 runningDuration = block.timestamp.sub(stream.startTime);
            // add any previous time accrued to the total duration of the stream
            pausableStream.durationElapsed = pausableStream.durationElapsed.add(
                runningDuration
            );
        }

        // Reset start and stop points
        stream.startTime = 0;
        stream.stopTime = 0;

        // Pause the stream
        pausableStreams[_streamId].isActive = false;
    }

    function startStream(uint256 _streamId)
        public
        _streamIsPausable(_streamId)
        _streamIsPaused(_streamId)
    {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        // Need a way to calculate the duration elapsed on the fly here
        if (pausableStream.duration == pausableStream.durationElapsed) {
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

    event PausableStreamCreated(
        uint256 id,
        uint256 startTime,
        uint256 deposit,
        uint256 duration,
        uint256 ratePerSecond,
        bool isActive
    );

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
            uint256 balanceAccrued
        )
    {
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];
        Types.Stream memory stream = streams[_streamId];

        if (pausableStream.isActive) {
            if (_hasStreamStopped(_streamId)) {
                return _buildFinishedStream(pausableStream, stream);
            } else if (_hasStreamStarted(_streamId)) {
                return _buildActiveStream(pausableStream, stream);
            } else {
                return _buildPendingStream(pausableStream, stream);
            }
        }

        return (
            pausableStream.duration,
            pausableStream.duration.sub(pausableStream.durationElapsed),
            pausableStream.durationElapsed,
            false,
            stream.deposit,
            stream.ratePerSecond.mul(pausableStream.durationElapsed)
        );
    }

    modifier _streamIsPausable(uint256 _streamId) {
        require(
            _isStreamPausable(_streamId),
            "Cannot pause a stream of this type"
        );
        _;
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
    function _buildFinishedStream(
        Types.PausableStream memory pausableStream,
        Types.Stream memory stream
    )
        internal
        view
        returns (
            uint256 duration,
            uint256 durationElapsed,
            uint256 durationRemaining,
            bool isActive,
            uint256 deposit,
            uint256 balanceAccrued
        )
    {
        return (
            pausableStream.duration,
            pausableStream.duration,
            0,
            false,
            stream.deposit,
            stream.deposit
        );
    }

    function _buildActiveStream(
        Types.PausableStream memory pausableStream,
        Types.Stream memory stream
    )
        internal
        view
        returns (
            uint256 duration,
            uint256 durationElapsed,
            uint256 durationRemaining,
            bool isActive,
            uint256 deposit,
            uint256 balanceAccrued
        )
    {
        uint256 runTime = block.timestamp.sub(stream.startTime);
        uint256 durationElapsed = runTime.add(pausableStream.durationElapsed);

        uint256 durationRemaining = pausableStream.duration.sub(
            durationElapsed
        );

        uint256 balanceAccrued = stream.ratePerSecond.mul(durationElapsed);

        return (
            pausableStream.duration,
            durationElapsed,
            durationRemaining,
            true,
            stream.deposit,
            balanceAccrued
        );
    }

    // todo check multiplication by potential 0
    function _buildPendingStream(
        Types.PausableStream memory pausableStream,
        Types.Stream memory stream
    )
        internal
        view
        returns (
            uint256 duration,
            uint256 durationElapsed,
            uint256 durationRemaining,
            bool isActive,
            uint256 deposit,
            uint256 balanceAccrued
        )
    {
        return (
            pausableStream.duration,
            durationElapsed,
            pausableStream.duration,
            true,
            stream.deposit,
            stream.ratePerSecond.mul(durationElapsed)
        );
    }

    function _isStreamPausable(uint256 _streamId) internal view returns (bool) {
        return Types.StreamType.PausableStream == streams[_streamId].streamType;
    }

    function _ratePerSecond(uint256 _deposit, uint256 _duration)
        internal
        override
        view
        returns (uint256)
    {
        return _deposit.div(_duration);
    }

    function _isStreamActive(uint256 _streamId) internal view returns (bool) {
        return pausableStreams[_streamId].isActive;
    }

    function _hasStreamStarted(uint256 _streamId) internal view returns (bool) {
        return block.timestamp >= streams[_streamId].startTime;
    }

    function _hasStreamStopped(uint256 _streamId) internal view returns (bool) {
        return block.timestamp >= streams[_streamId].stopTime;
    }
}
