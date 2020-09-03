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

    function startPausableStream(
        address _recipient,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _duration,
        uint256 _startTime
    ) public returns (uint256 streamId) {
        return
            pausableStream.createPausableStream(
                _recipient,
                _deposit,
                _tokenAddress,
                _duration,
                _startTime
            );
    }
}
