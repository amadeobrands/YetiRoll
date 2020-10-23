import React from 'react'
import { Wrapper } from './styled';
import { Route, Switch } from 'react-router-dom';

// Nested
import List from './List'
import Single from './Single'

const Dashboard: React.FC = () => {
    return (
        <Wrapper>
            <Switch>
                <Route exact path={'/dashboard/invoice'} component={List} />
                <Route path={'/dashboard/invoice/:invoice'} component={Single} />
            </Switch>
        </Wrapper>
    );
}

export default Dashboard;
