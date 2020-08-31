//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

library Types {

    enum StreamType {
        FixedDurationStream,
        PausableStream,
        SplitStream
    }

    struct Stream {
        uint256 startTime;
        uint256 deposit;
        uint256 ratePerSecond;
        uint256 remainingBalance;
        address sender;
        address tokenAddress;
        bool isEntity;
        address recipient;
        StreamType type;
    }

    struct FixedDurationStream {
        uint256 stopTime;
    }

    struct PausableStream {
        uint256 duration;
        uint256 durationElapsed;
        bool isActive;
    }

    struct SplitStream {
        address[] recipients;
    }
}
