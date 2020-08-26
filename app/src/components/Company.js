import React from 'react';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const {useEffect} = require("react");

const {useState} = require("react");

const Company = (props) => {
    console.log(props.company);
    const [balance, setBalance] = useState(undefined);

    if (undefined === balance) {
        return (
            <div>
                Awaiting company
            </div>
        )
    }

    return (
        <Container>
            <Grid container spacing={2}>
                {balance}
            </Grid>
        </Container>
    )
}

export default Company;