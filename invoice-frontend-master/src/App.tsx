import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@app/shared/style/theme';
import { GlobalStyle } from '@app/shared/style/global';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from '@app/container/Dashboard';
import Login from '@app/container/Login'

import { Classes } from '@blueprintjs/core'

import "./css/flexboxgrid.min.css"

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
            <div className={`${Classes.DARK} container`}>
                <Switch>
                    <Route exact path={'/login'} component={Login} />
                    <Route path={'/dashboard'} component={Dashboard} />
                </Switch>
            </div>

        </BrowserRouter>
    </ThemeProvider>
);

export default App;
