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

        IERC20(_token).approve(lendingPoolCore, _amount);
        console.log(lendingPool);
        LendingPool(lendingPool).deposit(_token, _amount, 0);

        AToken aToken = AToken(aTokenPair[_token]);

        console.log("Token %s", _token);
        console.log("A token %s", aTokenPair[_token]);

        console.log("amount %s", _amount);
        console.log("ERC20 balance %s", IERC20(_token).balanceOf(address(this)));
        console.log("A token amount %s", aToken.balanceOf(address(this)));

        console.log("msgsender %s", msg.sender);

        AToken(aTokenPair[_token]).transfer(msg.sender, _amount);


        console.log("a token balance %s", aToken.balanceOf(msg.sender));
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
