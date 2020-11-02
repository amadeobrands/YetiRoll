pragma solidity ^0.6.0;

interface ILendingPoolAddressesProvider {

    function getLendingPool() external view returns (address);

    function getLendingPoolCore() external view returns (address payable);
}