pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Aave
import "./interface/ILendingPoolAddressesProvider.sol";
import "./interface/LendingPool.sol";
import "./interface/AToken.sol";

import "hardhat/console.sol";

// https://docs.aave.com/developers/deployed-contracts/deployed-contract-instances
contract AaveAdaptor is Ownable {
    ILendingPoolAddressesProvider public lendingPoolAddressesProvider;

    address public lendingPool;

    address public lendingPoolCore;

    mapping(address => address) public aTokenPair;

    event AssetDeposited(address _token, address _who, uint256 _amount, uint256 _timestamp);

    event AssetWithdrawn(address _token, address _who, uint256 _amount, uint256 _timestamp);

    constructor(address _lendingPoolAddressesProvider) public {
        setLendingPoolAddressesProvider(_lendingPoolAddressesProvider);
        updateLendingPoolAddress();
        updateLendingPoolCoreAddress();
    }

    function setLendingPoolAddressesProvider(address _lendingPoolAddressProvider) public onlyOwner {
        lendingPoolAddressesProvider = ILendingPoolAddressesProvider(_lendingPoolAddressProvider);
    }

    function updateLendingPoolAddress() public {
        lendingPool = lendingPoolAddressesProvider.getLendingPool();
    }

    function updateLendingPoolCoreAddress() public {
        lendingPoolCore = lendingPoolAddressesProvider.getLendingPoolCore();
    }

    function deposit(address _token, uint256 _amount) external {
        emit AssetDeposited(_token, msg.sender, _amount, block.timestamp);

        console.log("Approving the LP Core contract to spend %s", _amount);
        IERC20(_token).approve(lendingPoolCore, _amount);

        console.log("Depositing %s", _amount);
        LendingPool(lendingPool).deposit(_token, _amount, 0);

        AToken aToken = AToken(aTokenPair[_token]);

        uint256 aTokenBalance = AToken(aTokenPair[_token]).balanceOf(address(this));

        console.log("Transferring %s to %s", aTokenBalance, msg.sender);
        AToken(aTokenPair[_token]).transfer(msg.sender, aTokenBalance);
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
