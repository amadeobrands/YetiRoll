// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./lib/Types.sol";
import "./Sablier.sol";

contract PaymentStream is Sablier {
    using SafeMath for uint;

    mapping(uint256 => Types.PausableStream) private pausableStreams;
    uint256 public nextStreamId;

    modifier streamExists(uint256 streamId) {
        require(streams[streamId].isEntity, "stream does not exist");
        _;
    }


    function createPausableStream(
        address _recipient,
        uint _amount,
        uint _duration,
        address _ercTokenAddress
    ) public payable {
        uint ratePerSecond = ratePerSecond();

        pausableStreams[nextStreamId] = Types.PausableStream(
            msg.value,
            msg.value,
            _duration,
            0,
            false,
            _recipient,
            msg.sender,
            _ercTokenAddress
        );
    }

    function ratePerSecond(uint _amountInWei, uint _duration) internal view returns (uint) {
        uint amountPerSecond = _amount.div(_duration);

        uint hourly = payPerHour.mul(10 ** 18);
        uint minutely = hourly.div(60);
        return minutely.div(60);
    }

    function getStream(uint256 streamId)
    external
    view
    streamExists(streamId)
    returns (
        uint256 ratePerSecond
    )
    {
        return streams[streamId].ratePerSecond;
    }

}
