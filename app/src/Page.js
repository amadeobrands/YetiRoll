import React from 'react';
import Grid from "@material-ui/core/Grid";
import {ContractFactory, providers} from "ethers";
import StreamCompany from "./build/StreamCompany.json";
import Container from "@material-ui/core/Container";
import Company from "./components/Company";

const {useEffect} = require("react");

const {useState} = require("react");

const Page = () => {
    const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const [company, setCompany] = useState(undefined);

    const streamCompanyFactory = new ContractFactory(
        StreamCompany.abi,
        StreamCompany.bytecode,
        provider.getSigner()
    );
    useEffect(() => {
        streamCompanyFactory.deploy().then(contract => {
            setCompany(contract)
        })
    }, []);

    if (undefined === company) {
        return (
            <div>
                Awaiting company
            </div>
        )
    }

    return (
        <Container>
            <Grid container spacing={2}>
                <Company company={company} />
            </Grid>
        </Container>
    )
}

export default Page;