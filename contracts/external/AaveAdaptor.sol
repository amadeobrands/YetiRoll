pragma solidity ^0.6.0;

import "./interface/Aave.sol";

contract AaveAdaptor {

    LendingPool aave;

    function setAave(address _aave) public {
        aave = LendingPool(_aave);
    }

    function borrow(address _token, uint256 _amount) public {
        aave.
    }
}
