pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/Aave.sol";

// https://docs.aave.com/developers/deployed-contracts/deployed-contract-instances
contract AaveAdaptor is Ownable {
    using SafeERC20 for IERC20;

    LendingPool aave;

    mapping(address => address) public aTokenPair;

    event AssetDeposited(address _token, address _who, uint256 _amount);

    function setAave(address _aave) external onlyOwner {
        aave = LendingPool(_aave);
    }

    function deposit(address _token, uint256 _amount) external {
        emit AssetDeposited(_token, msg.sender, _amount);

        IERC20(_token).approve(address(aave), _amount);

        aave.deposit(_token, _amount, 0);

        IERC20 aToken = IERC20(aTokenPair[_token]);

        aToken.transfer(msg.sender, aToken.balanceOf(address(this)));
    }

    function setATokenPair(address _token, address _aToken) external onlyOwner {
        aTokenPair[_token] = _aToken;
    }
}
