// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/Erc20/IErc20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ExchangeAdaptor.sol";

contract Treasury is AccessControl, ReentrancyGuard {
    ExchangeAdaptor exchangeAdaptor;

    // @dev mapping from User address to ERC20 address then to Balances
    mapping(address => mapping(address => Balance)) userBalances;

    // @dev clients deposited balance along with unallocated balance
    struct Balance {
        uint256 totalBalance;
        uint256 availableBalance;
    }

    function setExchangeAdaptor(address _exchangeAdaptor) public {
        exchangeAdaptor = ExchangeAdaptor(_exchangeAdaptor);
    }

    function deposit(
        address _token,
        address _who,
        uint256 _amount
    ) public {
        increaseInternalBalance(_token, _who, _amount);

        IERC20(_token).transferFrom(_who, address(this), _amount);
    }

    function withdraw(
        address _token,
        address _from,
        address _to,
        uint256 _amount
    )
        public
        nonReentrant
        hasSufficientAvailableBalance(_from, _token, _amount)
    {
        decreaseInternalBalance(_token, _from, _amount);

        IERC20(_token).transfer(_to, _amount);
    }

    function withdrawAs(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution,
        address _from,
        address _to
    )
        public
        nonReentrant
        hasSufficientAvailableBalance(_from, _tokenSell, _amountToSell)
    {
        decreaseInternalBalance(_tokenSell, _from, _amountToSell);

        IERC20(_tokenSell).transfer(address(exchangeAdaptor), _amountToSell);

        exchangeAdaptor.exchange(
            _tokenSell,
            _tokenBuy,
            _amountToSell,
            _minAmountToBuy,
            _distribution,
            _to
        );
    }

    function decreaseInternalBalance(
        address _token,
        address _who,
        uint256 _amount
    ) internal {
        userBalances[_who][_token].totalBalance -= _amount;
        userBalances[_who][_token].availableBalance -= _amount;
    }

    function increaseInternalBalance(
        address _token,
        address _who,
        uint256 _amount
    ) internal {
        userBalances[_who][_token].totalBalance += _amount;
        userBalances[_who][_token].availableBalance += _amount;
    }

    function viewUserTokenBalance(address _token, address _who)
        public
        view
        returns (uint256 totalBalance, uint256 availableBalance)
    {
        return (
            userBalances[_who][_token].totalBalance,
            userBalances[_who][_token].availableBalance
        );
    }

    modifier hasSufficientAvailableBalance(
        address _from,
        address _token,
        uint256 _amount
    ) {
        require(
            userBalances[_from][_token].availableBalance > _amount,
            "Insufficient balance to withdraw"
        );
        _;
    }
}
