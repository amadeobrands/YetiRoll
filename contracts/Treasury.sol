// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ExchangeAdaptor.sol";

// Notes for improvement - allocating funds does not relate to an address nor to a stream, would be beneficial
// to know where the funds are allocated to. This can be handled by the stream manager but needs strong coordination
// between the 2 services
contract Treasury is AccessControl {
    using SafeMath for uint256;

    bytes32 public constant TREASURY_ADMIN = keccak256("TREASURY_ADMIN");
    bytes32 public constant TREASURY_OPERATOR = keccak256("TREASURY_OPERATOR");

    ExchangeAdaptor exchangeAdaptor;

    // @dev mapping from User address to ERC20 address then to Balances
    mapping(address => mapping(address => Balance)) userBalances;

    // @dev clients deposited balance along with allocated balance
    struct Balance {
        uint256 deposited;
        uint256 allocated;
    }

    // @dev set contract creator as the admin & initiate the Treasury Operator role
    constructor() public {
        _setupRole(TREASURY_ADMIN, msg.sender);
        _setRoleAdmin(TREASURY_OPERATOR, TREASURY_ADMIN);
    }

    // @dev allows changing of the exchange adaptor - can be expanded past 1inch in future if needed
    function setExchangeAdaptor(address _exchangeAdaptor)
        public
        onlyTreasuryAdmin
    {
        exchangeAdaptor = ExchangeAdaptor(_exchangeAdaptor);
    }

    // @dev set address as treasury operator, likely to be a stream manager but perhaps different use cases later on
    function setTreasuryOperator(address _who) public onlyTreasuryAdmin {
        grantRole(TREASURY_OPERATOR, _who);
    }

    // @dev allow deposits of erc20 tokens
    function deposit(address _token, uint256 _amount) public {
        depositFunds(_token, msg.sender, _amount);

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }

    // @dev funds are able to be reallocated to different accounts (I.E when paying someone or during the lifetime of a
    // stream, this means they do not have to be withdrawn out of the platform and can later on be streamed out again
    function transferFunds(
        address _token,
        address _sender,
        address _recipient,
        uint256 _amount
    )
        public
        onlyTreasuryOperator
        hasSufficientAllocatedFunds(_token, _sender, _amount)
    {
        withdrawFunds(_token, _sender, _amount);
        depositFunds(_token, _recipient, _amount);
        deallocateFunds(_token, _sender, _amount);
    }

    // @dev allows withdrawal from the treasury, can be called by the depositor
    function withdraw_public(
        address _token,
        address _recipient,
        uint256 _amount
    ) public hasBalanceToWithdraw(_token, msg.sender, _amount) {
        withdraw(_token, msg.sender, _recipient, _amount);
    }

    // @dev allows withdrawal from the treasury, can only be called by the treasury operator
    function withdraw_protected(
        address _token,
        address _sender,
        address _recipient,
        uint256 _amount
    ) public onlyTreasuryOperator {
        withdraw(_token, _sender, _recipient, _amount);
    }

    // @dev allows withdrawal from the treasury, can only be called by the treasury operator
    function withdraw(
        address _token,
        address _sender,
        address _recipient,
        uint256 _amount
    ) internal hasBalanceToWithdraw(_token, _sender, _amount) {
        withdrawFunds(_token, _sender, _amount);

        IERC20(_token).transfer(_recipient, _amount);
    }

    // @dev performs a swap allowing users to withdraw a different token to the deposited one
    function withdrawAs_public(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution,
        address _recipient
    ) public {
        withdrawAs(
            _tokenSell,
            _tokenBuy,
            _amountToSell,
            _minAmountToBuy,
            _distribution,
            msg.sender,
            _recipient
        );
    }

    // @dev performs a swap allowing users to withdraw a different token to the deposited one
    // this is locked so only Treasury Operators can control it
    function withdrawAs_protected(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution,
        address _sender,
        address _recipient
    ) public onlyTreasuryOperator {
        withdrawAs(
            _tokenSell,
            _tokenBuy,
            _amountToSell,
            _minAmountToBuy,
            _distribution,
            _sender,
            _recipient
        );
    }

    function withdrawAs(
        address _tokenSell,
        address _tokenBuy,
        uint256 _amountToSell,
        uint256 _minAmountToBuy,
        uint256[] memory _distribution,
        address _sender,
        address _recipient
    ) internal hasBalanceToWithdraw(_tokenSell, _sender, _amountToSell) {
        withdrawFunds(_tokenSell, _sender, _amountToSell);

        IERC20(_tokenSell).transfer(address(exchangeAdaptor), _amountToSell);

        exchangeAdaptor.exchange(
            _tokenSell,
            _tokenBuy,
            _amountToSell,
            _minAmountToBuy,
            _distribution,
            _recipient
        );
    }

    // @dev once a stream is started, funds are allocated and locked from being withdrawn
    // by the account which started the stream
    function allocateFunds(
        address _token,
        address _who,
        uint256 _amount
    ) public onlyTreasuryOperator {
        userBalances[_who][_token].allocated = userBalances[_who][_token]
            .allocated
            .add(_amount);
    }

    // @dev called when funds are withdrawn, decrease the deposited balance
    function withdrawFunds(
        address _token,
        address _who,
        uint256 _amount
    ) internal {
        userBalances[_who][_token].deposited = userBalances[_who][_token]
            .deposited
            .sub(_amount);
    }

    // @dev called when funds are deposited, increase the deposited balance
    function depositFunds(
        address _token,
        address _who,
        uint256 _amount
    ) internal {
        userBalances[_who][_token].deposited = userBalances[_who][_token]
            .deposited
            .add(_amount);
    }

    // @dev once a stream is started, funds are allocated and locked from being withdrawn
    // by the account which started the stream
    function deallocateFunds(
        address _token,
        address _who,
        uint256 _amount
    ) internal onlyTreasuryOperator {
        userBalances[_who][_token].allocated = userBalances[_who][_token]
            .allocated
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
    function viewAvailableBalance(address _token, address _who)
        public
        view
        returns (uint256)
    {
        return
            userBalances[_who][_token].deposited.sub(
                userBalances[_who][_token].allocated
            );
    }

    // @dev check if the address has the role Treasury Admin
    modifier onlyTreasuryAdmin() {
        require(hasRole(TREASURY_ADMIN, msg.sender), "Not Treasury Admin");
        _;
    }

    // @dev check if the address has the role Treasury Operator
    modifier onlyTreasuryOperator() {
        require(
            hasRole(TREASURY_OPERATOR, msg.sender),
            "Not Treasury Operator"
        );
        _;
    }

    // @dev ensure there is enough balance to perform withdrawal
    modifier hasBalanceToWithdraw(
        address _token,
        address _who,
        uint256 _amount
    ) {
        require(
            viewAvailableBalance(_token, _who) >= _amount,
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
