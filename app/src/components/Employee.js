import React from "react";
import {BigNumber} from "ethers";

const {useEffect} = require("react");

const {useState} = require("react");

const {useCallback} = require("react");


const Employee = (props) => {
    let {company, provider, alice, employeeAddress} = props;

    const [employee, setEmployee] = useState(undefined);

    useEffect(() => {
        if (undefined !== alice) {
            company.functions.employees(alice).then(console.log)
        }
    }, [alice]);

    return (
        <div>

        </div>
    )

}

export default Employee;