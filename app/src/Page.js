import React from 'react';
import {ContractFactory, providers} from "ethers";
import StreamCompany from "./build/StreamCompany.json";
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
        <div>
            <p>Company address: {company.address}</p>
            <Company company={company} provider={provider}/>
        </div>
    )
}

export default Page;