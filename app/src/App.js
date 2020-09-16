import React from "react";
import "./App.css";
import {Drizzle, generateStore} from '@drizzle/store'
import {Provider} from "react-redux";
import { drizzleReactHooks } from 'drizzle-react';

import ERC20 from './build/ERC20.json';

const options = {
    contracts: [
        ERC20
    ]
};

const drizzleStore = generateStore({
    options
});

const drizzle = new Drizzle(
    options,
    drizzleStore
);

const App = () => {

    return (
        <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
            <Provider store={drizzleStore}>
                <drizzleReactHooks.Initializer
                    error="There was an error."
                    loadingContractsAndAccounts="Also still loading."
                    loadingWeb3="Still loading."
                >
                    <div>
                        testing
                    </div>
                </drizzleReactHooks.Initializer>
            </Provider>
        </drizzleReactHooks.DrizzleProvider>
    )

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