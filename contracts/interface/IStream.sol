// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

interface IStream {
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
}
