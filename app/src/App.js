import React, {useState} from "react";
import "./App.css";
import {Contract, providers} from "ethers";
import StreamManager from "./build/StreamManager.json";
import MockERC20 from "./build/MockERC20.json";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import AccountCircle from '@material-ui/icons/AccountCircle';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TimeKeeper from "./components/TimeKeeper";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    padding: {
        padding: theme.spacing(1),
    },
}));

const App = () => {
    const classes = useStyles();

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
        <Container maxWidth="xl">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Streams</Typography>
                </Toolbar>
            </AppBar>
            <Box my={2}>
                <Paper className={classes.padding}>
                    <Typography variant="h4">Start a payment stream</Typography>
                    <form noValidate autoComplete="off" className={classes.padding}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth className={classes.padding}>
                                    <InputLabel htmlFor="input-with-icon-adornment">Recipient</InputLabel>
                                    <Input
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <AccountCircle/>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth className={classes.padding}>
                                    <TextField
                                        id="datetime-local"
                                        label="Stream Start"
                                        type="datetime-local"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth className={classes.padding}>
                                    <TextField
                                        id="datetime-local"
                                        label="Stream Stop"
                                        type="datetime-local"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth className={classes.padding}>
                                    <Button variant="contained" color="primary">
                                        Create Stream
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
                <Box>
                    <TimeKeeper
                        provider={provider}
                        streamManager={streamManager}
                        time={time}
                        setTime={setTime}
                    />
                    <Typography variant="h6">Erc20 address: {erc20Address}</Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default App;