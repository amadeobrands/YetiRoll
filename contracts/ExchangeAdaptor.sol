// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interface/IOneSplit.sol";

contract ExchangeAdaptor is Ownable {
    using SafeERC20 for IERC20;

    IOneSplit oneInchExchange;

    function setOneInch(address _oneInchAddress) public onlyOwner {
        oneInchExchange = IOneSplit(_oneInchAddress);
    }

    // todo this is not working
    function exchange(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution,
        address _to
    ) public onlyOwner returns (uint256) {
        SafeERC20.safeIncreaseAllowance(
            IERC20(_tokenSell),
            address(oneInchExchange),
            _amountToSell
        );

        return
            oneInchExchange.swap(
                IERC20(_tokenSell),
                IERC20(_tokenBuy),
                _amountToSell,
                _minAmountToBuy,
                _distribution,
                0
            );

        //        IERC20(_tokenBuy).transfer(_to, amountPurchased);
    }
}
