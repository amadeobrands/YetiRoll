import React from "react";
import {BigNumber} from "ethers";
import PausableStreamBuilder from "./PausableStreamBuilder";

const {useCallback, useEffect, useState} = require("react");

const Streams = (props) => {
  let {streamManager, provider, token} = props;

  const [balance, setBalance] = useState(undefined);

  // todo balance of token rather than eth balance
  useEffect(() => {
    provider
      .getBalance(streamManager.address)
      .then(BigNumber.from)
      .then(setBalance);
  }, []);

  if (undefined === provider || undefined === balance) {
    return <div>Awaiting balance</div>;
  }

  return (
    <div>
      Balance: {balance.toString()}
      <PausableStreamBuilder
        token={token}
        streamManager={streamManager}
        provider={provider}
      />
    </div>
  );
};

export default Streams;
