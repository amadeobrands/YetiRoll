pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/Aave.sol";
import "./interface/AToken.sol";

// https://docs.aave.com/developers/deployed-contracts/deployed-contract-instances
contract AaveAdaptor is Ownable {
    LendingPool aave;

    mapping(address => address) public aTokenPair;

    event AssetDeposited(
        address _token,
        address _who,
        uint256 _amount,
        uint256 _timestamp
    );

    event AssetWithdrawn(
        address _token,
        address _who,
        uint256 _amount,
        uint256 _timestamp
    );

    function setAave(address _aave) external onlyOwner {
        aave = LendingPool(_aave);
    }

    function deposit(address _token, uint256 _amount) external {
        emit AssetDeposited(_token, msg.sender, _amount, block.timestamp);

        IERC20(_token).approve(address(aave), _amount);

        aave.deposit(_token, _amount, 0);

        AToken aToken = AToken(aTokenPair[_token]);

        aToken.transfer(msg.sender, aToken.balanceOf(address(this)));
    }

    function withdraw(address _token, uint256 _amount) external {
        AToken aToken = AToken(aTokenPair[_token]);
        emit AssetWithdrawn(_token, msg.sender, _amount, block.timestamp);

        aToken.redeem(_amount);

        IERC20(_token).transfer(
            msg.sender,
            IERC20(_token).balanceOf(address(this))
        );
    }

    function redeemTokens(address _token, uint256 _amount) external {}

    function setATokenPair(address _token, address _aToken) external onlyOwner {
        aTokenPair[_token] = _aToken;
    }
}
