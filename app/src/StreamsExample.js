import React from "react";
import {BigNumber} from "ethers";
import Streams from "./components/Streams";

const {useEffect, useState} = require("react");

const StreamsExample = (props) => {
  let {provider, streamManager, erc20} = props;

  const [aliceAddress, setAliceAddress] = useState(undefined);
  const [aliceBalance, setAliceBalance] = useState(undefined);

  let alice = provider.getSigner(0);

  useEffect(() => {
    if (undefined === aliceAddress) {
      alice.getAddress().then(setAliceAddress);
    }
  }, []);

  useEffect(() => {
    if (
      undefined !== aliceAddress &&
      undefined !== erc20 &&
      undefined === aliceBalance
    ) {
      erc20.balanceOf(aliceAddress).then(setAliceBalance);
    }
  }, [erc20, aliceBalance, aliceAddress]);

  if (undefined === alice || undefined === aliceBalance) {
    return <div>Fetching Alice's balance</div>;
  }

  return (
    <div>
      <p>Stream manager's address: {streamManager.address}</p>
      <p>Token address: {erc20.address}</p>
      <p>
        Alice's address : {aliceAddress} & balance: {aliceBalance.toString()}
      </p>
      <Streams
        provider={provider}
        streamManager={streamManager}
        erc20={erc20}
      />
    </div>
  );
};

export default StreamsExample;
