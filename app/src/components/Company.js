import React from 'react';
import {BigNumber} from "ethers";
import EmployeeForm from "./EmployeeForm";

const {useCallback} = require("react");

const {useEffect} = require("react");

const {useState} = require("react");

const Company = (props) => {
    let {company, provider} = props;

    const [balance, setBalance] = useState(undefined);

    useEffect(() => {
        provider.getBalance(company.address).then(BigNumber.from).then(setBalance)
    }, []);

    if (undefined === provider || undefined === balance) {
        return (
            <div>
                Awaiting balance
            </div>
        )
    }

    return (
        <div>
            Balance: {balance.toString()}
            <EmployeeForm
                company={company}
                provider={provider}
            />
        </div>
    )
}

export default Company;