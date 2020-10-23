pragma solidity ^0.6.0;

import "../Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Stream.sol";

contract StreamManager is Ownable {
    Treasury treasury;
    Stream stream;

    function setTreasury(address _treasury) public onlyOwner {
        treasury = Treasury(_treasury);
    }

    function setStream(address _stream) public onlyOwner {
        stream = Stream(_stream);
    }

    function balance(address _token) public view returns (uint256) {
        return treasury.viewAvailableBalance(msg.sender, _token);
    }

    function startStream(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _start,
        uint256 _stop
    ) public {
        uint256 balance = treasury.viewAvailableBalance(msg.sender, _token);

        require(balance >= _amount, "Not enough balance to start stream");

        treasury.allocateFunds(_token, msg.sender, _amount);

        stream.createStream(msg.sender, _to, _amount, _token, _start, _stop);
    }

    function withdrawFromStream(
        uint256 _streamId,
        uint256 _amount,
        address _recipient
    ) public {
        (
            address sender,
            address recipient,
            ,
            address tokenAddress,
            ,
            ,
            ,
            ,

        ) = stream.getStream(_streamId);

        require(msg.sender == recipient, "Not your stream");

        stream.withdraw(_streamId, _amount, msg.sender);

        treasury.withdraw(tokenAddress, sender, _recipient, _amount);
    }

    // @dev allows withdrawal from the stream, if there is not sufficient balance accrued, the Stream contract
    // will automatically revert
    function claimFromStream(uint256 _streamId, uint256 _amount) public {
        (
            address sender,
            address recipient,
            ,
            address tokenAddress,
            ,
            ,
            ,
            ,

        ) = stream.getStream(_streamId);

        require(recipient == msg.sender, "Only Stream Recipient");

        stream.withdraw(_streamId, _amount, msg.sender);

        treasury.transferFunds(tokenAddress, sender, msg.sender, _amount);
    }
}
