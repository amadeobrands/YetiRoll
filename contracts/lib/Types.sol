//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

library Types {

    struct Stream {
        uint256 ratePerSecond;
        uint256 remainingBalance;
        uint256 startTime;
        address sender;
        address tokenAddress;


        // ??
        bool isEntity;
    }

    struct FixedDurationStream {
        uint256 deposit;
        uint256 stopTime;
        address recipient;
    }

    struct PausableStream {
        uint256 deposit;
        uint256 remainingBalance;
        uint256 duration;
        uint256 timeActive;
        bool isActive;
        address recipient;
        address sender;
        address tokenAddress;
        // ??
//        bool isEntity;
    }

    struct SplitStream {
        uint256 deposit;
        uint256 remainingBalance;
        uint256 startTime;
        uint256 duration;
        bool isActive;
        address[] recipients;
        address sender;
        address tokenAddress;
        // ??
        bool isEntity;
    }
}
