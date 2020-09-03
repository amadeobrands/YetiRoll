pragma solidity ^0.6.0;

import "./PaymentStream.sol";
import "./PausableStream.sol";
import "./Stream.sol";

contract StreamManager {
    Stream fixedDurationStream;
    PausableStream pausableStream;

    constructor() public {
        pausableStream = new PausableStream();
        fixedDurationStream = new Stream();
    }

    function createPausableStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _duration,
        uint256 _startTime
    ) public returns (uint256 streamId) {
        return
            pausableStream.createStream(
                _recipient,
                _deposit,
                _tokenAddress,
                _duration,
                _startTime
            );
    }

    function pauseStream(uint256 _streamId) public {
        pausableStream.pauseStream(_streamId);
    }

    function startStream(uint256 _streamId) public {
        pausableStream.startStream(_streamId);
    }
}
