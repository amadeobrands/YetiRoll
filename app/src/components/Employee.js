import React, {useEffect, useState, useCallback} from "react";
import {utils, Contract} from "ethers";
import StreamEmployee from "../build/StreamEmployee.json";

const Employee = (props) => {
    let {company, provider, alice} = props;

    const [employeeAddress, setEmployeeAddress] = useState(undefined);
    const [employeeContract, setEmployeeContract] = useState(undefined);
    const [payPerSecond, setPayPerSecond] = useState(undefined);
    const [balanceEarned, setBalanceEarned] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isWorking, setIsWorking] = useState(undefined);

    useEffect(() => {
        company.employees(alice).then(setEmployeeAddress)
    }, [alice]);

    useEffect(() => {
        if (undefined !== employeeAddress) {
            setEmployeeContract(new Contract(employeeAddress, StreamEmployee.abi, provider.getSigner()));
        }
    }, [employeeAddress]);

    useEffect(() => {
        if (undefined !== employeeContract) {
            employeeContract.payPerSecond().then(setPayPerSecond);
        }
    }, [employeeContract]);

    useEffect(() => {
        if (undefined !== payPerSecond) {
            const interval = setInterval(() => {
                setSeconds(seconds => seconds + 1)
                setBalanceEarned(payPerSecond.mul(seconds))
            }, 1000)

            return () => clearInterval(interval);
        }
    }, [payPerSecond, seconds]);

    const startWorking = async () => {
        await employeeContract.startWorking()
        await employeeContract.isWorking().then(setIsWorking)
    }

    const displayWorkingClock = () => {
        if (isWorking) {
            return (
                <div>
                    <p>Pay per second {payPerSecond.toString()}</p>
                    <p>Time worked {seconds}</p>
                    <p>Balance {utils.formatEther(balanceEarned.toString())}</p>
                </div>
            )
        }
        return (
            <div>
                Not working
            </div>
        )
    }

    return (
        <div>
            <p>Contract address: {employeeAddress}</p>
            <input type="submit"
                   value="Start working"
                   onClick={
                       useCallback(
                           () => startWorking(),
                           [employeeContract]
                       )
                   }
            />

            {displayWorkingClock()}
        </div>
    )

}

export default Employee;