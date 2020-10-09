import React from "react";
import Streams from "./components/Streams";
import Grid from "@material-ui/core/Grid";

const {useEffect, useState} = require("react");

const StreamsExample = (props) => {
  let {provider, streamManager, erc20, time} = props;

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
    <Grid container xs={12}>
      <Grid item xs={6}>
        <p>Stream manager's address: {streamManager.address}</p>
        <p>Token address: {erc20.address}</p>
        <p>
          Alice's address : {aliceAddress} & balance: {aliceBalance.toString()}
        </p>
      </Grid>
      <Grid item xs={5}>
        <Streams
          provider={provider}
          streamManager={streamManager}
          erc20={erc20}
          time={time}
        />
      </Grid>
    </Grid>
  );
};

export default StreamsExample;
