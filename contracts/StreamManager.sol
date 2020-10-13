pragma solidity ^0.6.0;

import "./Treasury.sol";
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

    function startStream(
        address _token,
        address _who,
        uint256 _amount,
        uint256 _start,
        uint256 _stop
    ) public {
        uint256 balance = treasury.viewAvailableBalance(msg.sender, _token);

        require(balance >= _amount, "Not enough balance to start stream");

        treasury.allocateFunds(_token, msg.sender, _amount);

        stream.createStream(_who, _amount, _token, _start, _stop);
    }
}
