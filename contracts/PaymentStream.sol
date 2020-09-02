// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./lib/Types.sol";
import "./Sablier.sol";

//http://patorjk.com/software/taag/#p=display&f=Big&t=View
contract PaymentStream {
    using SafeMath for uint256;

    //  __  __           _ _  __ _
    // |  \/  |         | (_)/ _(_)
    // | \  / | ___   __| |_| |_ _  ___ _ __
    // | |\/| |/ _ \ / _` | |  _| |/ _ \ '__|
    // | |  | | (_) | (_| | | | | |  __/ |
    // |_|  |_|\___/ \__,_|_|_| |_|\___|_|
    modifier _baseStreamRequirements(
        address _recipient,
        uint256 _deposit,
        uint256 _startTime
    ) {
        require(
            _recipient != address(0x00),
            "Cannot start a stream to the 0x address"
        );
        require(
            _recipient != address(this),
            "Cannot start a stream to the stream contract"
        );
        require(_recipient != msg.sender, "Cannot start a stream to yourself");
        require(_deposit > 0, "Cannot start a stream with 0 balance");
        require(
            _startTime >= block.timestamp,
            "Cannot start a stream in the past"
        );
        _;
    }

    modifier _streamExists(uint256 _streamId) {
        require(streams[_streamId].isEntity, "Stream does not exist");
        _;
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

    //
    //  ______               _
    // |  ____|             | |
    // | |____   _____ _ __ | |_ ___
    // |  __\ \ / / _ \ '_ \| __/ __|
    // | |___\ V /  __/ | | | |_\__ \
    // |______\_/ \___|_| |_|\__|___/
    event PausableStreamCreated(
        uint256 id,
        uint256 startTime,
        uint256 deposit,
        uint256 duration,
        uint256 ratePerSecond,
        bool isActive
    );

    mapping(uint256 => Types.Stream) private streams;
    mapping(uint256 => Types.PausableStream) private pausableStreams;
    uint256 public nextStreamId;

    constructor() public {
        nextStreamId = 1;
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
            bool isActive
        )
    {
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];
        Types.Stream memory stream = streams[_streamId];

        // Different cases
        // Stream is active & start time + duration is inside the current time period
        // Stream is active & start time + duration is outside of current time period
        // Stream is active & start time + duration is before the current time period
        // Stream is inactive and has duration

        // Stream has finished
        if (pausableStream.duration == pausableStream.durationElapsed) {}

        if (pausableStream.isActive) {
            // Stream has ended
            if (block.timestamp > stream.stopTime) {
                return (
                    pausableStream.duration,
                    pausableStream.duration,
                    0,
                    false
                );
                // stream is yet to start
            } else if (stream.startTime > block.timestamp) {} else {
                uint256 runTime = block.timestamp.sub(stream.startTime);
                uint256 durationElapsed = runTime.add(
                    pausableStream.durationElapsed
                );

                uint256 timeRemaining = stream.stopTime.sub(durationElapsed);

                return (
                    pausableStream.duration,
                    durationElapsed,
                    timeRemaining,
                    true
                );
            }
        }

        stream.startTime = block.timestamp.add(durationRemaining);

        if (durationElapsed > stream.startTime.add(duration)) {
            // Stream has finished
        }

        //        if (stream.isActive) {
        //            if (stream.startTime > block.timestamp) {
        //                if()
        //                uint durationElapsed = block.timestamp.sub(stream.startTime);
        //
        //            }
        //
        //            return (
        //            stream.duration,
        //
        //            )
        //            }
        //            return (
        //            stream.duration,
        //            stream.durationElapsed,
        //            stream.duration.sub(stream.durationElapsed),
        //            stream.isActive
        //            );
    }

    function getStream(uint256 streamId)
        external
        view
        _streamExists(streamId)
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

    //  ______  __  __          _
    // |  ____|/ _|/ _|        | |
    // | |__  | |_| |_ ___  ___| |_ ___
    // |  __| |  _|  _/ _ \/ __| __/ __|
    // | |____| | | ||  __/ (__| |_\__ \
    // |______|_| |_| \___|\___|\__|___/
    function createStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _startTime,
        uint256 _stopTime
    )
        public
        _baseStreamRequirements(_recipient, _deposit, _startTime)
        returns (uint256 streamId)
    {
        require(
            _isNonZeroLengthStream(_startTime, _stopTime),
            "Stream must last a least a second"
        );

        uint256 duration = _stopTime.sub(_startTime);
        uint256 ratePerSecond = _ratePerSecond(_deposit, duration);
        require(ratePerSecond > 0, "Rate per second is under 0");

        uint256 streamId = nextStreamId;
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

    function createPausableStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _duration,
        uint256 _startTime
    )
        public
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
            stopTime: 0,
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
        _streamIsPausable
        _streamIsActive(_streamId)
    {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        if (false == _hasStreamStarted(_streamId)) {
            revert("Stream has not started yet");
        }

        if (_hasStreamStopped(_streamId)) {
            revert("Stream has finished");
        }

        // How long has the stream run for
        uint256 runningDuration = block.timestamp.sub(stream.startTime);

        // add any previous time accrued to the total duration of the stream
        pausableStream.durationElapsed = pausableStream.durationElapsed.add(
            runningDuration
        );

        // Reset start and stop points
        stream.startTime = 0;
        stream.stopTime = 0;

        // Pause the stream
        pausableStreams[_streamId].isActive = false;
    }

    function startStream(uint256 _streamId)
        public
        _streamIsPausable
        _streamIsPaused(_streamId)
    {
        Types.Stream memory stream = streams[_streamId];
        Types.PausableStream memory pausableStream = pausableStreams[_streamId];

        // Need a way to calculate the duration elapsed
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

    //  _____       _                        _  __      ___
    // |_   _|     | |                      | | \ \    / (_)
    //   | |  _ __ | |_ ___ _ __ _ __   __ _| |  \ \  / / _  _____      _____
    //   | | | '_ \| __/ _ \ '__| '_ \ / _` | |   \ \/ / | |/ _ \ \ /\ / / __|
    //  _| |_| | | | ||  __/ |  | | | | (_| | |    \  /  | |  __/\ V  V /\__ \
    // |_____|_| |_|\__\___|_|  |_| |_|\__,_|_|     \/   |_|\___| \_/\_/ |___/
    function _isStreamPausable(uint256 _streamId) internal view returns (bool) {
        return Types.StreamType.PausableStream == streams[_streamId].streamType;
    }

    function _ratePerSecond(uint256 _deposit, uint256 _duration)
        internal
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

    function _isStreamActive(uint256 _streamId) internal view returns (bool) {
        return pausableStreams[_streamId].isActive;
    }

    function _hasStreamStarted(uint256 _streamId) internal view returns (bool) {
        return streams[_streamId].startTime > block.timestamp;
    }

    function _hasStreamStopped(uint256 _streamId) internal view returns (bool) {
        return block.timestamp >= streams[_streamId].stopTime;
    }
}
