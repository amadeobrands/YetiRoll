import React from "react";
import Paper from "@material-ui/core/Paper";
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    padding: {
        padding: theme.spacing(1),
    },
}));

const StartStreamForm = () => {
    const classes = useStyles();

    return (
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
                                defaultValue={new Date()}
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
    )
};

export default StartStreamForm;