// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "./StreamEmployee.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StreamCompany is AccessControl {
    using SafeMath for uint;

    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE");

    modifier onlyEmployer() {
        require(hasRole(EMPLOYER_ROLE, msg.sender));
        _;
    }

    mapping(address => StreamEmployee) public employees;

    constructor() public {
        _setupRole(EMPLOYER_ROLE, msg.sender);
    }

    receive() external payable {
        topUp();
    }

    function topUp() public payable {
    }

    function createEmployee(address _address, uint _amount) public onlyEmployer {
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
