import React from "react";
import "./App.css";
import {Contract, providers} from "ethers";

import MockERC20 from "./build/MockERC20.json";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import StartStreamForm from "./components/StartStreamForm";

const {useState} = require("react");

const App = () => {
  const provider = new providers.JsonRpcProvider(
    // "https://ropsten.infura.io/v3/73bd0ea4c5d64e248551358ec2f1a8c3"
    "http://127.0.0.1:8545/"
  );

  let erc20Address = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";

  let erc20 = new Contract(erc20Address, MockERC20.abi, provider);

  return (
    <Container maxWidth="xl">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Streams</Typography>
        </Toolbar>
      </AppBar>
      <Box my={2}>
        <StartStreamForm provider={provider} erc20={erc20} />
        <Box>
          <Typography variant="h6">Erc20 address: {erc20Address}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
