// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract StreamEmployee {
    using SafeMath for uint;

    address public employeeAddress;
    uint public payPerHour;
    bool public isWorking;
    uint public workStarted;

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
        if (payAccrued() > 0) {
            calculatePay();
        }

        isWorking = false;
        workStarted = 0;
    }

    function calculatePay() internal {
        balance = balance.add(payAccrued());
    }

    function payAccrued() public view returns (uint) {
        if (timeWorkedInSeconds() > 0) {
            return timeWorkedInSeconds().mul(payPerSecond());
        }

        return 0;
    }

    function payPerSecond() public view returns (uint) {
        uint hourly = payPerHour.mul(10 ** 18);
        uint minutely = hourly.div(60);
        return minutely.div(60);
    }

    function timeWorkedInSeconds() public view returns (uint) {
        return block.timestamp.sub(workStarted);
    }
}
