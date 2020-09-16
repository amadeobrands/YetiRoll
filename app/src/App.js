import React, {useState} from "react";
import "./App.css";
import {Contract, providers} from "ethers";
import StreamManager from "./build/StreamManager.json";
import MockERC20 from "./build/MockERC20.json";
import Container from "@material-ui/core/Container";
import { Drizzle } from '@drizzle/store'

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TimeKeeper from "./components/TimeKeeper";
import StartStreamForm from "./components/StartStreamForm";

import ERC20 from './build/ERC20.json';

const options = {
    contracts: [
        ERC20
    ]
}

const drizzle = new Drizzle(options)

const App = () => {


};

// const App = () => {
//     const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
//     const [time, setTime] = useState(undefined);
//
//     let streamManagerAddress = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";
//     let erc20Address = "0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf";
//
//     let streamManager = new Contract(
//         streamManagerAddress,
//         StreamManager.abi,
//         provider
//     );
//
//     let erc20 = new Contract(erc20Address, MockERC20.abi, provider);
//
//     return (
//         <Container maxWidth="xl">
//             <AppBar position="static">
//                 <Toolbar>
//                     <Typography variant="h6">Streams</Typography>
//                 </Toolbar>
//             </AppBar>
//             <Box my={2}>
//                 <StartStreamForm />
//                 <Box>
//                     <TimeKeeper
//                         provider={provider}
//                         streamManager={streamManager}
//                         time={time}
//                         setTime={setTime}
//                     />
//                     <Typography variant="h6">Erc20 address: {erc20Address}</Typography>
//                 </Box>
//             </Box>
//         </Container>
//     );
// };

export default App;