import React, {useState} from "react";
import StreamsExample from "./StreamsExample.js";
import "./App.css";
import {Contract, providers} from "ethers";
import StreamManager from "./build/StreamManager.json";
import MockERC20 from "./build/MockERC20.json";
import TimeKeeper from "./components/TimeKeeper";

const App = () => {
  const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
  const [time, setTime] = useState(undefined);

  let streamManagerAddress = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";
  let erc20Address = "0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf";

  let streamManager = new Contract(
    streamManagerAddress,
    StreamManager.abi,
    provider
  );

  let erc20 = new Contract(erc20Address, MockERC20.abi, provider);

  return (
    <div>
      <TimeKeeper
        provider={provider}
        streamManager={streamManager}
        time={time}
        setTime={setTime}
      />

      <StreamsExample
        provider={provider}
        streamManager={streamManager}
        erc20={erc20}
        time={time}
      />
    </div>
  );
};

export default App;
