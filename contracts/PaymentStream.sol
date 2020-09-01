// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./lib/Types.sol";
import "./Sablier.sol";

//http://patorjk.com/software/taag/#p=display&f=Big&t=View
contract PaymentStream {
    using SafeMath for uint;

    //  __  __           _ _  __ _
    // |  \/  |         | (_)/ _(_)
    // | \  / | ___   __| |_| |_ _  ___ _ __
    // | |\/| |/ _ \ / _` | |  _| |/ _ \ '__|
    // | |  | | (_) | (_| | | | | |  __/ |
    // |_|  |_|\___/ \__,_|_|_| |_|\___|_|
    modifier baseStreamRequirements(
        address _recipient,
        uint _deposit,
        uint _startTime
    ) {
        require(_recipient != address(0x00), "stream to the zero address");
        require(_recipient != address(this), "stream to the contract itself");
        require(_recipient != msg.sender, "stream to the caller");
        require(_deposit > 0, "deposit is zero");
        require(_startTime >= block.timestamp, "start time before block.timestamp");
        _;
    }

    modifier streamExists(uint256 _streamId) {
        require(streams[_streamId].isEntity, "Stream does not exist");
        _;
    }

    modifier streamIsPausable(uint256 _streamId) {
        require(
            _isStreamPausable(_streamId),
            "Cannot pause a stream of this type"
        );
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

    //  __      ___
    //  \ \    / (_)
    //   \ \  / / _  _____      __
    //    \ \/ / | |/ _ \ \ /\ / /
    //     \  /  | |  __/\ V  V /
    //      \/   |_|\___| \_/\_/
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
        ratePerSecond : ratePerSecond,
        recipient : _recipient,
        sender : msg.sender,
        startTime : _startTime,
        stopTime : _stopTime,
        tokenAddress : _tokenAddress,
        isEntity : true,
        streamType : Types.StreamType.FixedTimeStream
        });

        return streamId;
    }

    function createPausableStream(
        address _recipient,
        uint _deposit,
        address _tokenAddress,
        uint _duration,
        uint _startTime
    ) public payable
    baseStreamRequirements(_recipient, _deposit, _startTime)
    returns (uint _streamId){
        uint streamId = nextStreamId;
        uint ratePerSecond = _ratePerSecond(_deposit, _duration);
        uint stopTime = _startTime.add(_duration);

        streams[streamId] = Types.Stream({
        remainingBalance : _deposit,
        deposit : _deposit,
        ratePerSecond : ratePerSecond,
        recipient : _recipient,
        sender : msg.sender,
        startTime : _startTime,
        stopTime : 0,
        tokenAddress : _tokenAddress,
        isEntity : true,
        streamType : Types.StreamType.PausableStream
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
        duration : _duration,
        durationElapsed : 0,
        isActive : true
        });

        return streamId;
    }

    function pauseStream(uint _streamId) public streamIsPausable(_streamId) {
        pausableStreams[_streamId].isActive = false;
    }

    //  _____       _                        _  __      ___
    // |_   _|     | |                      | | \ \    / (_)
    //   | |  _ __ | |_ ___ _ __ _ __   __ _| |  \ \  / / _  _____      _____
    //   | | | '_ \| __/ _ \ '__| '_ \ / _` | |   \ \/ / | |/ _ \ \ /\ / / __|
    //  _| |_| | | | ||  __/ |  | | | | (_| | |    \  /  | |  __/\ V  V /\__ \
    // |_____|_| |_|\__\___|_|  |_| |_|\__,_|_|     \/   |_|\___| \_/\_/ |___/
    function _isStreamPausable(uint _streamId) internal view returns (bool) {
        return Types.StreamType.PausableStream == streams[_streamId].streamType;
    }

    function _ratePerSecond(uint _deposit, uint _duration) internal view returns (uint) {
        return _deposit.div(_duration);
    }

    function isNonZeroLengthStream(uint _startTime, uint _stopTime) internal view returns (bool) {
        return _stopTime.sub(_startTime) > 0;
    }
}
