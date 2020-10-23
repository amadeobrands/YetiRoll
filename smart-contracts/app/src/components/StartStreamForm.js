import React, {useCallback, useState} from "react";

import Paper from "@material-ui/core/Paper";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Contract} from "ethers";
import Stream from "../build/Stream.json";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  padding: {
    padding: theme.spacing(1),
  },
}));

const StartStreamForm = (props) => {
  const classes = useStyles();
  let {provider, erc20} = props;
  const [recipient, setRecipient] = useState(undefined);
  const [startTime, setStartTime] = useState(undefined);
  const [stopTime, setStopTime] = useState(undefined);
  const [streamId, setStreamId] = useState(undefined);

  const alice = provider.getSigner(0);

  const stream = new Contract(
    "0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf",
    Stream.abi,
    alice
  );

  const createStream = () => {
    const start = Math.round(new Date(startTime).getTime() / 1000);
    const stop = Math.round(new Date(stopTime).getTime() / 1000);

    stream.createStream(recipient, 1000, erc20.address, start, stop);
  };

  const getStream = () => {
    stream.getStream(streamId).then(console.log);
  };

  return (
    <Paper className={classes.padding}>
      <Typography variant="h4">Start a payment stream</Typography>
      <form
        noValidate
        autoComplete="off"
        className={classes.padding}
        onSubmit={(event) => event.preventDefault()}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth className={classes.padding}>
              <InputLabel htmlFor="input-with-icon-adornment">
                Recipient
              </InputLabel>
              <Input
                id="input-with-icon-adornment"
                onChange={(event) => setRecipient(event.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
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
                onChange={(event) => setStartTime(event.target.value)}
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
                onChange={(event) => setStopTime(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth className={classes.padding}>
              <Button
                variant="contained"
                color="primary"
                onClick={useCallback(createStream)}
              >
                Create Stream
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth className={classes.padding}>
              <InputLabel htmlFor="input-with-icon-adornment">
                Recipient
              </InputLabel>
              <Input
                id="input-with-icon-adornment"
                onChange={(event) => setStreamId(event.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth className={classes.padding}>
              <Button
                variant="contained"
                color="primary"
                onClick={useCallback(getStream)}
              >
                Get Stream
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StartStreamForm;
