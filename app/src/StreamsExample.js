import React from "react";
import {ContractFactory, providers} from "ethers";
import StreamManager from "./build/StreamManager.json";
import MockERC20 from "./build/MockERC20.json";
import Streams from "./components/Streams";

const {useEffect, useState} = require("react");

const StreamsExample = () => {
  const provider = new providers.JsonRpcProvider("http://127.0.0.1:7545/");
  const [manager, setManager] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [alice, setAlice] = useState(undefined);
  const [aliceBalance, setAliceBalance] = useState(undefined);

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
      setManager(manager);
    });
  }, []);

  useEffect(() => {
    Erc20Factory.deploy("Mock", "MOCK").then((token) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    provider.listAccounts().then((accounts) => {
      setAlice(accounts[0]);
    });
  }, []);

  // Mint some tokens for Alice
  useEffect(() => {
    if (
      undefined !== alice &&
      undefined !== token &&
      undefined === aliceBalance
    ) {
      token.mint(alice, 100000);

      token.balanceOf(alice).then(setAliceBalance);
    }
  }, [alice, token, aliceBalance]);

  useEffect(() => {
    if (undefined !== aliceBalance) {
      let aliceToken = token.attach(alice);
      aliceToken.approve(manager.address, 100000);
    }
  }, [aliceBalance]);

  if (undefined === manager || undefined === token) {
    return <div>Awaiting stream manager & ERC 20 token</div>;
  }

  if (undefined === alice || undefined === aliceBalance) {
    return <div>Minting tokens for Alice</div>;
  }

  return (
    <div>
      <p>Stream manager's address: {manager.address}</p>
      <p>Token address: {token.address}</p>
      <p>
        Alice's address : {alice} & balance: {aliceBalance.toString()}
      </p>
      <Streams streamManager={manager} provider={provider} token={token} />
    </div>
  );
};

export default StreamsExample;
