pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExchangeAdaptor.sol";

contract Treasury is Ownable {
    ExchangeAdaptor exchangeAdaptor;

    function setExchangeAdaptor(address _exchangeAdaptor) public onlyOwner {
        exchangeAdaptor = ExchangeAdaptor(_exchangeAdaptor);
    }
}
