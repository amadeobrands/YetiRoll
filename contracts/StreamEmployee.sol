// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

contract StreamEmployee {
    address public employeeAddress;
    uint public payPerHour;
    bool isWorking;
    uint workStarted;
    uint totalEarned;
    uint balance;

    constructor(uint _payPerHour, address _employeeAddress) public {
        payPerHour = _payPerHour;
        employeeAddress = _employeeAddress;
    }
}
