import React, {useEffect, useState, useCallback} from "react";
import {Contract} from "ethers";
import StreamEmployee from "../build/StreamEmployee.json";

const Employee = (props) => {
    let {company, provider, alice} = props;

    const [employeeAddress, setEmployeeAddress] = useState(undefined);
    const [employeeContract, setEmployeeContract] = useState(undefined);

    useEffect(() => {
        company.employees(alice).then(setEmployeeAddress)
    }, [alice]);

    useEffect(() => {
        if(undefined !== employeeAddress) {
            setEmployeeContract(new Contract(employeeAddress, StreamEmployee.abi, provider));
        }
    }, [employeeAddress]);

    const startWorking = async () => {
        employeeContract.payPerHour().then(console.log)
    }

    return (
        <div>
            <p>Contract address: {employeeAddress}</p>
            <input type="submit"
                   onClick={
                       useCallback(
                           () => startWorking(),
                           [employeeContract]
                       )
                   }
            />
        </div>
    )

}

export default Employee;