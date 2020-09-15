pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/Erc20/IErc20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./PausableStream.sol";
import "./Stream.sol";
import "./lib/Types.sol";

contract StreamManager is ReentrancyGuard {
    Stream fixedDurationStream;
    PausableStream pausableStream;

    // todo inject streams
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
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _deposit);

        return
            pausableStream.createStream(
                _recipient,
                _deposit,
                _tokenAddress,
                _duration,
                _startTime
            );
    }

    function withdrawFromStream(
        uint256 _streamId,
        uint256 _amount,
        address _who,
        Types.StreamType _streamType
    ) public nonReentrant {
        if (_streamType == Types.StreamType.FixedTimeStream) {
            //
        } else if (_streamType == Types.StreamType.PausableStream) {
            require(
                pausableStream.canWithdrawFunds(_streamId, _amount, _who),
                "Unable to withdraw from stream"
            );

            pausableStream.withdraw(_streamId, _amount, _who);
            IERC20(pausableStream.getStreamTokenAddress(_streamId)).transfer(
                _who,
                _amount
            );
        }
    }

    function pauseStream(uint256 _streamId) public {
        pausableStream.pauseStream(_streamId);
    }

    function startStream(uint256 _streamId) public {
        pausableStream.startStream(_streamId);
    }

    function getPausableStream(uint256 _streamId)
        public
        view
        returns (
            uint256 duration,
            uint256 durationElapsed,
            uint256 durationRemaining,
            uint256 deposit,
            uint256 balanceAccrued,
            uint256 startTime,
            bool isRunning
        )
    {
        return pausableStream.getPausableStream(_streamId);
    }

    function now() public view returns (uint256 time) {
        return block.timestamp;
    }
}
