pragma solidity ^0.6.0;

contract StreamLender {
    // @dev stream id -> contributor address -> amountPledged
    mapping(uint256 => mapping(address => uint256)) contributions;

    // @dev stream id -> desired amount to loan
    mapping(uint256 => uint256) streamsForLoan;

    // @dev listing a stream renders it locked, the stream recipient will be unable to withdraw any value from it.
    // funds will be taken from the treasury and deposited into Aave, from there the client can use the available
    // lending power to borrow any asset listed by Aave. They will be subject to liquidation of their position is under
    // collateralised
    function borrowAgainstStream(uint256 _streamId, uint256 _amountToBorrow) public {
        // check stream has started
        // calculate the value of the stream, total stream value - any value taken out
        // lock the stream, prevent the user from withdrawing from the stream
        // deposit assets into Aave
        // borrow against deposited asset
    }

    function payBackLoan(uint256 _streamId, uint256 _amount) public {}
}
