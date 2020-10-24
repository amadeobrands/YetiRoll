pragma solidity ^0.6.0;

import "./Treasury.sol";

contract FundManager is Ownable {
    Treasury treasury;

    function setTreasury(address _treasury) public onlyOwner {
        treasury = Treasury(_treasury);
    }

    function withdrawTokensToAccount(
        address _token,
        address _to,
        uint256 _amount
    ) public {
        treasury.withdrawFrom(_token, msg.sender, _to, _amount);
    }

    function swapTokensAndWithdrawToAccount(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution,
        address _to
    ) public {
        treasury.withdrawAs_protected(
            _tokenSell,
            _tokenBuy,
            _amountToSell,
            _minAmountToBuy,
            _distribution,
            msg.sender,
            _to
        );
    }
}
