pragma solidity ^0.6.0;

interface AToken {
    function redeem(uint256 _amount) external;

    function balanceOf(address _user) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}
