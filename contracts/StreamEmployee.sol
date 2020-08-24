// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract StreamEmployee {
    using SafeMath for uint;

    event e(uint time);

    address public employeeAddress;
    uint public payPerHour;
    bool public isWorking;
    uint public workStarted;

    uint public hoursWorked;

    uint totalEarned;
    uint public balance;

    modifier workHasNotBegun() {
        require(false == isWorking, "Work has already been started");
        _;
    }

    modifier workHasBegun() {
        require(true == isWorking, "Work has not been started");
        _;
    }

    constructor(uint _payPerHour, address _employeeAddress) public {
        payPerHour = _payPerHour;
        employeeAddress = _employeeAddress;
    }

    function startWorking() public workHasNotBegun {
        isWorking = true;
        workStarted = block.timestamp;
    }

    function stopWorking() public workHasBegun {
        isWorking = false;
        calculatePay();
    }

    function calculatePay() internal {
        uint _now = block.timestamp;
        uint _hoursWorked = _now.sub(workStarted);
        emit e(_hoursWorked);
        //        uint pay =
    }
}
