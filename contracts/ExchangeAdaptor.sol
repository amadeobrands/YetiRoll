pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IOneSplit.sol";

contract ExchangeAdaptor is Ownable {
    IOneSplit oneInchExchange;

    function setOneInch(address _oneInchAddress) public onlyOwner {
        oneInchExchange = IOneSplit(_oneInchAddress);
    }

    function exchange(
        address _sell,
        address _buy,
        uint256 _amount,
        uint256 _minReturn,
        uint256[] memory _distribution
    ) public onlyOwner returns (uint256) {
        return
            oneInchExchange.swap(
                IERC20(_sell),
                IERC20(_buy),
                _amount,
                _minReturn,
                _distribution,
                0
            );
    }
}
