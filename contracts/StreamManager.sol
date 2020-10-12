pragma solidity ^0.6.0;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Stream.sol";

contract StreamManager is Ownable {

    Treasury treasury;
    Stream treasury;

    function setTreasury(address _treasury) public onlyOwner {
        treasury = Treasury(_treasury);
    }

    function setStream(address _stream) public onlyOwner {
        stream = Stream(_stream);
    }
}
