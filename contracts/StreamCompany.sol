// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "./StreamEmployee.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract StreamCompany {
    using SafeMath for uint;

    mapping(address => StreamEmployee) public employees;

    receive() external payable {
        topUp();
    }

    function topUp() public payable {
    }

    // todo only owner
    function createEmployee(address _address, uint _amount) public {
        StreamEmployee employee = new StreamEmployee(
            _amount,
            _address
        );

        employees[_address] = employee;
    }

    function getPayment(uint _amount) public {
        payout(msg.sender, _amount);
    }

    function payout(address payable _address, uint _amount) internal {
        StreamEmployee employee = employees[_address];
        require(employee.balance() >= _amount, "You have not earned enough funds to withdraw that amount");
        require(address(this).balance >= _amount, "Not enough funds");

        _address.transfer(_amount);
    }
}
