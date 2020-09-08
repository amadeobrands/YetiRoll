import React from "react";
import {ContractFactory, providers} from "ethers";
import StreamManager from "./build/StreamManager.json";
import MockERC20 from "./build/MockERC20.json";
import Streams from "./components/Streams";

const {useEffect, useState} = require("react");

const StreamsExample = () => {
  const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");

  useEffect(() => {
    // provider.send("evm_setNextBlockTimestamp", [Date.now()]);
    //
    // // Process the block
    // provider.send("evm_mine", []);
  }, []);

  const [streamManager, setStreamManager] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [aliceBalance, setAliceBalance] = useState(undefined);
  const [aliceAddress, setAliceAddress] = useState(undefined);
  let alice = provider.getSigner(0);

  const streamManagerFactory = new ContractFactory(
    StreamManager.abi,
    StreamManager.bytecode,
    provider.getSigner()
  );

  const Erc20Factory = new ContractFactory(
    MockERC20.abi,
    MockERC20.bytecode,
    provider.getSigner()
  );

  useEffect(() => {
    streamManagerFactory.deploy().then((manager) => {
      setStreamManager(manager);
    });
  }, []);

  useEffect(() => {
    Erc20Factory.deploy("Mock", "MOCK").then((token) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    if (undefined === aliceAddress) {
      alice.getAddress().then(setAliceAddress);
    }
  }, []);

  useEffect(() => {
    if (
      undefined !== aliceAddress &&
      undefined !== token &&
      undefined === aliceBalance
    ) {
      let contract = token.connect(alice);

      contract
        .mint(aliceAddress, 100000)
        .then(contract.balanceOf(aliceAddress).then(setAliceBalance));
      contract.approve(streamManager.address, 100000);
    }
  }, [token, aliceBalance, aliceAddress]);

  if (undefined === streamManager || undefined === token) {
    return <div>Awaiting stream manager & ERC 20 token</div>;
  }

  if (undefined === alice || undefined === aliceBalance) {
    return <div>Minting tokens for Alice</div>;
  }

  return (
    <div>
      <p>Stream manager's address: {streamManager.address}</p>
      <p>Token address: {token.address}</p>
      <p>
        Alice's address : {aliceAddress} & balance: {aliceBalance.toString()}
      </p>
      <Streams
        streamManager={streamManager}
        provider={provider}
        token={token}
      />
    </div>
  );
};

export default StreamsExample;
