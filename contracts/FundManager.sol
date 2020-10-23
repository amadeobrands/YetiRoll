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
        treasury.withdraw(_token, msg.sender, _to, _amount);
    }
}
