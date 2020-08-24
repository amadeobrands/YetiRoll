// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "./StreamEmployee.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract StreamCompany {
    using SafeMath for uint;

    mapping(address => StreamEmployee) public employees;

    uint public poolBalance;

    function topUp() public payable {
        require(msg.value > 0, "Must send funds to top up");

        poolBalance = poolBalance.add(msg.value);
    }

    // todo only owner
    function createEmployee(address _address, uint _amount) public {
        StreamEmployee employee = new StreamEmployee(
            _amount,
            _address
        );

        employees[_address] = employee;
    }
}
