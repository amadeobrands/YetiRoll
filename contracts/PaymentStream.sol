//// SPDX-License-Identifier: UNLICENSED
//
//pragma solidity ^0.6.0;
//
//import "@openzeppelin/contracts/math/SafeMath.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "./lib/Types.sol";
//import "./Sablier.sol";
//
////http://patorjk.com/software/taag/#p=display&f=Big&t=View
//contract PaymentStream {
//    using SafeMath for uint256;
//
//    //  __  __           _ _  __ _
//    // |  \/  |         | (_)/ _(_)
//    // | \  / | ___   __| |_| |_ _  ___ _ __
//    // | |\/| |/ _ \ / _` | |  _| |/ _ \ '__|
//    // | |  | | (_) | (_| | | | | |  __/ |
//    // |_|  |_|\___/ \__,_|_|_| |_|\___|_|
//    modifier _baseStreamRequirements(
//        address _recipient,
//        uint256 _deposit,
//        uint256 _startTime
//    ) {
//        require(
//            _recipient != address(0x00),
//            "Cannot start a stream to the 0x address"
//        );
//        require(
//            _recipient != address(this),
//            "Cannot start a stream to the stream contract"
//        );
//        require(_recipient != msg.sender, "Cannot start a stream to yourself");
//        require(_deposit > 0, "Cannot start a stream with 0 balance");
//        require(
//            _startTime >= block.timestamp,
//            "Cannot start a stream in the past"
//        );
//        _;
//    }
//
//    modifier _streamExists(uint256 _streamId) {
//        require(streams[_streamId].isEntity, "Stream does not exist");
//        _;
//    }
//
//    modifier _streamIsPausable(uint256 _streamId) {
//        require(
//            _isStreamPausable(_streamId),
//            "Cannot pause a stream of this type"
//        );
//        _;
//    }
//
//    modifier _streamIsActive(uint256 _streamId) {
//        require(_isStreamActive(_streamId), "Stream is not running");
//        _;
//    }
//
//    modifier _streamIsPaused(uint256 _streamId) {
//        require(false == _isStreamActive(_streamId), "Stream is running");
//        _;
//    }
//
//    //
//    //  ______               _
//    // |  ____|             | |
//    // | |____   _____ _ __ | |_ ___
//    // |  __\ \ / / _ \ '_ \| __/ __|
//    // | |___\ V /  __/ | | | |_\__ \
//    // |______\_/ \___|_| |_|\__|___/
//    event PausableStreamCreated(
//        uint256 id,
//        uint256 startTime,
//        uint256 deposit,
//        uint256 duration,
//        uint256 ratePerSecond,
//        bool isActive
//    );
//
//    mapping(uint256 => Types.Stream) private streams;
//    mapping(uint256 => Types.PausableStream) private pausableStreams;
//    uint256 public nextStreamId;
//
//    constructor() public {
//        nextStreamId = 1;
//    }
//
//    //  __      ___
//    //  \ \    / (_)
//    //   \ \  / / _  _____      __
//    //    \ \/ / | |/ _ \ \ /\ / /
//    //     \  /  | |  __/\ V  V /
//    //      \/   |_|\___| \_/\_/
//
//    // Different cases
//    // Stream is active & start time + duration is inside the current time period
//    // Stream is active & start time + duration is outside of current time period
//    // Stream is active & start time + duration is before the current time period
//    // Stream is inactive and has duration
//    function getPausableStream(uint256 _streamId)
//        external
//        view
//        returns (
//            uint256 duration,
//            uint256 durationElapsed,
//            uint256 durationRemaining,
//            bool isActive,
//            uint256 balanceAccrued
//        )
//    {
//        Types.PausableStream memory pausableStream = pausableStreams[_streamId];
//        Types.Stream memory stream = streams[_streamId];
//
//        if (pausableStream.isActive) {
//            if (_hasStreamStopped(_streamId)) {
//                return _buildFinishedPausedStream(pausableStream, stream);
//            } else if (_hasStreamStarted(_streamId)) {
//                return _buildActivePausedStream(pausableStream, stream);
//            } else {
//                return _buildPendingStream(pausableStream, stream);
//            }
//        }
//
//        return (
//            pausableStream.duration,
//            pausableStream.duration.sub(pausableStream.durationElapsed),
//            pausableStream.durationElapsed,
//            false,
//            stream.ratePerSecond.mul(pausableStream.durationElapsed)
//        );
//    }
//
//    function getStream(uint256 streamId)
//        external
//        view
//        _streamExists(streamId)
//        returns (
//            address sender,
//            address recipient,
//            uint256 deposit,
//            address tokenAddress,
//            uint256 startTime,
//            uint256 stopTime,
//            uint256 remainingBalance,
//            uint256 ratePerSecond
//        )
//    {
//        sender = streams[streamId].sender;
//        recipient = streams[streamId].recipient;
//        deposit = streams[streamId].deposit;
//        tokenAddress = streams[streamId].tokenAddress;
//        startTime = streams[streamId].startTime;
//        stopTime = streams[streamId].stopTime;
//        remainingBalance = streams[streamId].remainingBalance;
//        ratePerSecond = streams[streamId].ratePerSecond;
//    }
//
//    //  ______  __  __          _
//    // |  ____|/ _|/ _|        | |
//    // | |__  | |_| |_ ___  ___| |_ ___
//    // |  __| |  _|  _/ _ \/ __| __/ __|
//    // | |____| | | ||  __/ (__| |_\__ \
//    // |______|_| |_| \___|\___|\__|___/

//

//
//    //  _____       _                        _  __      ___
//    // |_   _|     | |                      | | \ \    / (_)
//    //   | |  _ __ | |_ ___ _ __ _ __   __ _| |  \ \  / / _  _____      _____
//    //   | | | '_ \| __/ _ \ '__| '_ \ / _` | |   \ \/ / | |/ _ \ \ /\ / / __|
//    //  _| |_| | | | ||  __/ |  | | | | (_| | |    \  /  | |  __/\ V  V /\__ \
//    // |_____|_| |_|\__\___|_|  |_| |_|\__,_|_|     \/   |_|\___| \_/\_/ |___/
//
//    function _buildFinishedPausedStream(
//        Types.PausableStream memory pausableStream,
//        Types.Stream memory stream
//    )
//        internal
//        view
//        returns (
//            uint256 duration,
//            uint256 durationElapsed,
//            uint256 durationRemaining,
//            bool isActive,
//            uint256 balanceAccrued
//        )
//    {
//        return (
//            pausableStream.duration,
//            pausableStream.duration,
//            0,
//            false,
//            stream.deposit
//        );
//    }
//
//    function _buildActivePausedStream(
//        Types.PausableStream memory pausableStream,
//        Types.Stream memory stream
//    )
//        internal
//        view
//        returns (
//            uint256 duration,
//            uint256 durationElapsed,
//            uint256 durationRemaining,
//            bool isActive,
//            uint256 balanceAccrued
//        )
//    {
//        uint256 runTime = block.timestamp.sub(stream.startTime);
//        uint256 durationElapsed = runTime.add(pausableStream.durationElapsed);
//
//        uint256 durationRemaining = pausableStream.duration.sub(
//            durationElapsed
//        );
//
//        uint256 balanceAccrued = stream.ratePerSecond.mul(durationElapsed);
//
//        return (
//            pausableStream.duration,
//            durationElapsed,
//            durationRemaining,
//            true,
//            balanceAccrued
//        );
//    }
//
//    // todo check multiplication by potential 0
//    function _buildPendingStream(
//        Types.PausableStream memory pausableStream,
//        Types.Stream memory stream
//    )
//        internal
//        view
//        returns (
//            uint256 duration,
//            uint256 durationElapsed,
//            uint256 durationRemaining,
//            bool isActive,
//            uint256 balanceAccrued
//        )
//    {
//        return (
//            pausableStream.duration,
//            durationElapsed,
//            pausableStream.duration,
//            true,
//            stream.ratePerSecond.mul(durationElapsed)
//        );
//    }
//}
