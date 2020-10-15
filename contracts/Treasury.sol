// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/Erc20/IErc20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ExchangeAdaptor.sol";

// Notes for improvement - allocating funds does not relate to an address nor to a stream, would be beneficial
// to know where the funds are allocated to. This can be handled by the stream manager but needs strong coordination
// between the 2 services
contract Treasury is AccessControl, ReentrancyGuard {
    using SafeMath for uint256;

    ExchangeAdaptor exchangeAdaptor;

    bytes32 public constant TREASURY_OPERATOR = keccak256("TREASURY_OPERATOR");

    // @dev mapping from User address to ERC20 address then to Balances
    mapping(address => mapping(address => Balance)) userBalances;

    // @dev clients deposited balance along with allocated balance
    struct Balance {
        uint256 deposited;
        uint256 allocated;
    }

    constructor() public {

    }

    // @dev allows changing of the exchange adaptor - can be expanded past 1inch in future if needed
    function setExchangeAdaptor(address _exchangeAdaptor) public {
        exchangeAdaptor = ExchangeAdaptor(_exchangeAdaptor);
    }

    // @dev allow deposits of specific tokens which can then be streamed out
    function deposit(
        address _token,
        address _who,
        uint256 _amount
    ) public {
        depositFunds(_token, _who, _amount);

        IERC20(_token).transferFrom(_who, address(this), _amount);
    }

    // @dev during lifetime of a stream a user may wish to transfer funds from the stream into their available balance
    function transferFunds(
        address _token,
        address _from,
        address _to,
        uint256 _amount
    ) public hasSufficientAllocatedFunds(_token, _from, _amount) {
        withdrawFunds(_token, _from, _amount);
        depositFunds(_token, _to, _amount);
        deallocateFunds(_token, _from, _amount);
    }

    // @dev allows withdrawal from the treasury, can be called by the depositor or by the stream manager
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
        withdrawFunds(_token, _from, _amount);

        IERC20(_token).transfer(_to, _amount);
    }

    // @dev performs a swap allowing users to withdraw a different token to the deposited one
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
        withdrawFunds(_tokenSell, _from, _amountToSell);

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

    // @dev once a stream is started, funds are allocated and locked from being withdrawn
    // by the account which started the stream
    function allocateFunds(
        address _token,
        address _who,
        uint256 _amount
    ) public {
        userBalances[_who][_token].allocated = userBalances[_who][_token]
            .allocated
            .add(_amount);
    }

    // @dev once a stream is started, funds are allocated and locked from being withdrawn
    // by the account which started the stream
    function deallocateFunds(
        address _token,
        address _who,
        uint256 _amount
    ) public {
        userBalances[_who][_token].allocated = userBalances[_who][_token]
            .allocated
            .sub(_amount);
    }

    // @dev called when funds are deposited, increase the deposited balance
    function depositFunds(
        address _token,
        address _who,
        uint256 _amount
    ) public {
        userBalances[_who][_token].deposited = userBalances[_who][_token]
            .deposited
            .add(_amount);
    }

    // @dev called when funds are withdrawn, decrease the deposited balance
    function withdrawFunds(
        address _token,
        address _who,
        uint256 _amount
    ) public {
        userBalances[_who][_token].deposited = userBalances[_who][_token]
            .deposited
            .sub(_amount);
    }

    // @dev See the total available tokens for client
    function viewUserTokenBalance(address _token, address _who)
        public
        view
        returns (uint256 deposited, uint256 allocated)
    {
        return (
            userBalances[_who][_token].deposited,
            userBalances[_who][_token].allocated
        );
    }

    // @dev subtract the allocated balance from the deposit to see the available funds
    function viewAvailableBalance(address _from, address _token)
        public
        view
        returns (uint256)
    {
        return
            userBalances[_from][_token].deposited.sub(
                userBalances[_from][_token].allocated
            );
    }

    // @dev ensure there is enough balance to perform withdrawal
    modifier hasSufficientAvailableBalance(
        address _from,
        address _token,
        uint256 _amount
    ) {
        require(
            viewAvailableBalance(_from, _token) >= _amount,
            "Insufficient balance to withdraw"
        );
        _;
    }

    // @dev ensure that funds have been allocated
    modifier hasSufficientAllocatedFunds(
        address _token,
        address _from,
        uint256 _amount
    ) {
        require(
            userBalances[_from][_token].allocated >= _amount,
            "Insufficient allocated balance"
        );
        _;
    }
}
