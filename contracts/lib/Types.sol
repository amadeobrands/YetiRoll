pragma solidity ^0.6.0;

library Types {
    struct FixedDurationStream {
        uint256 deposit;
        uint256 ratePerSecond;
        uint256 remainingBalance;
        uint256 startTime;
        uint256 stopTime;
        address recipient;
        address sender;
        address tokenAddress;

        // is compounding
        bool isEntity;
    }

    struct PausableStream {
        uint256 deposit;
        uint256 remainingBalance;
        uint256 startTime;
        uint256 duration;
        bool isActive;
        address recipient;
        address sender;
        address tokenAddress;
        // is compounding
        bool isEntity;
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
        // is compounding
        bool isEntity;
    }
}
