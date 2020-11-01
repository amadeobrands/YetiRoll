pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/Aave.sol";
import "./interface/AToken.sol";
import "hardhat/console.sol";

// https://docs.aave.com/developers/deployed-contracts/deployed-contract-instances
contract AaveAdaptor is Ownable {
    LendingPool public aave;

    mapping(address => address) public aTokenPair;

    event AssetDeposited(address _token, address _who, uint256 _amount, uint256 _timestamp);

    event AssetWithdrawn(address _token, address _who, uint256 _amount, uint256 _timestamp);

    constructor(address _aave) public {
        setAave(_aave);
    }

    function setAave(address _aave) public onlyOwner {
        aave = LendingPool(_aave);
    }

    function deposit(address _token, uint256 _amount) external {
        emit AssetDeposited(_token, msg.sender, _amount, block.timestamp);

        IERC20(_token).approve(address(aave), _amount);

        aave.deposit(_token, _amount, 0);

        AToken aToken = AToken(aTokenPair[_token]);

        console.log("Token %s", _token);
        console.log("A token %s", aTokenPair[_token]);

        console.log("amount %s", _amount);
        console.log("ERC20 balance %s", IERC20(_token).balanceOf(address(this)));
        console.log("A token amount %s", aToken.balanceOf(address(this)));
        //        aToken.transfer(msg.sender, aToken.balanceOf(address(this)));
    }

    function withdraw(address _token, uint256 _amount) external {
        AToken aToken = AToken(aTokenPair[_token]);
        emit AssetWithdrawn(_token, msg.sender, _amount, block.timestamp);

        aToken.redeem(_amount);

        IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
    }

    function redeemTokens(address _token, uint256 _amount) external {}

    function setATokenPair(address _token, address _aToken) external onlyOwner {
        console.log("Setting token pair %s- %s", _token, _aToken);

        aTokenPair[_token] = _aToken;

        console.log("Token pair set %s", aTokenPair[_token]);
    }
}
