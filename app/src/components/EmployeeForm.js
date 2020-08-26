import React, {useEffect, useState, useCallback} from "react";
import Employee from "./Employee";

const EmployeeForm = (props) => {
    let {company, provider} = props;

    const [alice, setAlice] = useState(undefined);
    const [hasEmployee, setHasEmployee] = useState(undefined);

    useEffect(() => {
        provider.listAccounts().then(value => value[0]).then(setAlice)
    }, []);

    const createEmployee = () => {
        company.createEmployee(
            alice, 100
        ).then(block => {
            if (block.confirmations > 0) {
                setHasEmployee(true)
            }
        })
    }

    const displayAddress = () => {
        return (
            <div>
                Sending address: {alice}
            </div>
        )
    }

    const displayEmployee = () => {
        if (undefined !== hasEmployee) {
            return (
                <Employee
                    company={company}
                    provider={provider}
                    alice={alice}
                />
            )
        }
    }

    return (
        <div>
            <form onSubmit={(event => event.preventDefault())}>
                <input
                    type="submit"
                    onClick={
                        useCallback(
                            () => createEmployee(),
                            [alice]
                        )
                    }
                />
            </form>
            {displayAddress()}
            {displayEmployee()}
            <p>
            </p>
        </div>
    )

}

export default EmployeeForm;