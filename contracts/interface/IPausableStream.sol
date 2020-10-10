// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

interface IPausableStream {
    event PausableStreamCreated(
        uint256 id,
        uint256 startTime,
        uint256 deposit,
        uint256 duration,
        uint256 ratePerSecond,
        bool isActive
    );

    //    function createStream(
    //        address _recipient,
    //        uint256 _deposit,
    //        address _tokenAddress,
    //        uint256 _duration,
    //        uint256 _startTime
    //    ) external returns (uint256 _streamId);
    //
    //    function withdrawFunds(
    //        uint256 _streamId,
    //        uint256 _amount,
    //        address _who
    //    ) external;
}
