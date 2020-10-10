pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IOneSplit.sol";

contract ExchangeAdaptor is Ownable {
    IOneSplit oneInchExchange;

    function setOneInch(address _oneInchAddress) public onlyOwner {
        oneInchExchange = IOneSplit(_oneInchAddress);
    }

    function exchange(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution
    ) public onlyOwner returns (uint256) {
        return
            oneInchExchange.swap(
                IERC20(_tokenSell),
                IERC20(_tokenBuy),
                _amountToSell,
                _minAmountToBuy,
                _distribution,
                0
            );
    }
}
