import React, { useEffect, useState } from 'react'
import { Wrapper } from './styled';
import { Route, Switch, useHistory } from 'react-router-dom'
import { Alignment, Button, Classes, Navbar, NavbarGroup } from '@blueprintjs/core'
import Invoice from './Invoice'
import Recipient from './Recipient'
import InvoiceTemplate from './InvoiceTemplate'
import { $user, fetchAuthUser, setAuthUser } from '@app/shared/store';
import { fetchCurrencyList } from './store';
import { useStore } from 'effector-react';

const Dashboard: React.FC = () => {

    const authUser = useStore($user)
    const [isAuthPassed, setIsAuthPassed] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchCurrencyList();
        fetchAuthUser().then((user) => {
            if (!user) {
                return history.replace('/login')
            }
            setIsAuthPassed(true)
        })
    }, [])

    const performLogout = () => {
        localStorage.removeItem('auth')
        setAuthUser({
            name: "",
            email: "",
            id: 0
        })
        history.replace("/login")
    }

    if (!isAuthPassed) return null;

    return (
        <Wrapper>
            <h1 className={`${Classes.HEADING} mb-2`}>Invoice Service Dashboard</h1>
            <Navbar className={'mb-3'}>
                <NavbarGroup align={Alignment.LEFT}>
                    <Button icon={'new-grid-item'} onClick={() => history.push('/dashboard/invoice')}
                            className={Classes.MINIMAL}>Invoices</Button>
                    <Button icon={'inherited-group'} onClick={() => history.push('/dashboard/recipient')}
                            className={Classes.MINIMAL}>Recipients</Button>
                    <Button icon={'layout-hierarchy'} onClick={() => history.push('/dashboard/invoice-template')}
                            className={Classes.MINIMAL}>Templates</Button>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button icon={'user'} minimal>{authUser.name}</Button>
                    <Button onClick={performLogout} icon={'disable'}>Logout</Button>
                </NavbarGroup>
            </Navbar>
            <Switch>
                <Route path={'/dashboard/invoice'} component={Invoice}/>
                <Route path={'/dashboard/recipient'} component={Recipient}/>
                <Route path={'/dashboard/invoice-template'} component={InvoiceTemplate}/>
            </Switch>
        </Wrapper>
    );
}

export default Dashboard;
