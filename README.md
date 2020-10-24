# YetiRoll
![YetoRoll Logo](https://i.imgur.com/QpYl9Xq.png)
## Concept
A decentralized online payrolling platform for seamless processing of payments for people connected to centralized and decentralized organizations.
The distribution of value has a lot of costs by implementing blockchain technology costs can be reduced and new innovative ways of distributing value can be invented. Not only the distribution but also the stable storage of value for corporations and individuals can be significantly improved.

## Technical
An application inspired by ERC1620 (payment stream) tokens
This extends on the idea of a payment stream and strives to implement different types of stream:

- Fixed duration streams
- Pausable streams
- Multi-recipient streams
- Stream to Stream payments

- A combination of all the above

- Non fungible token streams?

## Coding Convention

- Token always comes first in a list of addresses
- In a look up the name for the queried address would be _who. I.E to get balance for token the method would be:
function getBalance(address _token, address _who){}
- The address where funds originated will be called "Sender" and the destination address will be "Recipient"
function sendToken(address _token, address _sender, address _recipient){}



-- todo

- Add more tests around streams specifically withdrawal of funds
- Stream to stream payments
- More events emitted
- https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna#echidna-tutorial

Testing in a mock live environment can be achieved by following this guide
https://medium.com/ethereum-grid/forking-ethereum-mainnet-mint-your-own-dai-d8b62a82b3f7

Configuring code formatting
https://www.jetbrains.com/help/idea/prettier.html#ws_prettier_reformat_code

## License
[MIT](https://choosealicense.com/licenses/mit/)


