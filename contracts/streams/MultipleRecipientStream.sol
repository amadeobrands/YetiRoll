// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./lib/Types.sol";
import "./Stream.sol";

contract MultipleRecipientStream {
    using SafeMath for uint256;

    mapping(uint256 => mapping(address => uint256)) internal streams;

    Stream internal streamContract;
    uint256 public nextStreamId;

    constructor() public {
        nextStreamId = 1;
        streamContract = new Stream();
    }

    function createStream(
        address _sender,
        address[] memory _recipients,
        uint256 _deposit,
        address _tokenAddress,
        uint256 _startTime,
        uint256 _stopTime
    ) public returns (uint256) {
        uint256 currentStreamId = nextStreamId;
        nextStreamId = nextStreamId.add(1);

        uint256 depositShare = _deposit.div(_recipients.length);

        for (uint256 i = 0; i < _recipients.length; i++) {
            uint256 streamId = streamContract.createStream(
                _sender,
                _recipients[i],
                depositShare,
                _tokenAddress,
                _startTime,
                _stopTime
            );

            streams[currentStreamId][_recipients[i]] = streamId;
        }

        return currentStreamId;
    }

    function getStream(uint256 _streamId, address _address)
        public
        view
        returns (
            address sender,
            address recipient,
            uint256 deposit,
            address tokenAddress,
            uint256 startTime,
            uint256 stopTime,
            uint256 remainingBalance,
            uint256 ratePerSecond,
            uint256 balanceAccrued
        )
    {
        return streamContract.getStream(streams[_streamId][_address]);
    }

    function getStreamId(uint256 _streamId, address _address) public view returns (uint256 streamId) {
        return streams[_streamId][_address];
    }
}
