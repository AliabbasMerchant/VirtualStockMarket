import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import { AuthProvider } from '../contexts/auth';
import { StocksProvider } from '../contexts/stocks';
import { AssetsProvider } from '../contexts/assets';
import { OrdersProvider } from '../contexts/orders';
import { SocketProvider, SocketContext } from '../contexts/socket';

import Login from './Login';
import Main from './Main';
import Navbar from './Navbar';
import Orders from './Orders';
import Portfolio from './Portfolio';
import PrivateRoute from './PrivateRoute';
import Register from './Register';
import Stock from './Stock';
import VSM from './VSM';

function App() {
    return (
        <Router>
            <AuthProvider>
                <StocksProvider>
                    <AssetsProvider>
                        <OrdersProvider>
                            <SocketProvider>
                                <SocketContext.Consumer>
                                    {(socketContext) =>
                                        <div className="app">
                                            <Navbar />

                                            <Switch>
                                                <Route exact path="/">
                                                    <Main />
                                                </Route>
                                                <Route path="/login">
                                                    <Login />
                                                </Route>
                                                <Route path="/register">
                                                    <Register />
                                                </Route>
                                                <PrivateRoute exact path="/vsm">
                                                    <VSM />
                                                </PrivateRoute>
                                                <PrivateRoute path='/vsm/portfolio'>
                                                    <Portfolio />
                                                </PrivateRoute>
                                                <PrivateRoute path='/vsm/orders'>
                                                    <Orders />
                                                </PrivateRoute>
                                                <PrivateRoute path='/vsm/stock'>
                                                    <Stock />
                                                </PrivateRoute>
                                                <Route path="*">
                                                    <Redirect to="/" />
                                                </Route>
                                            </Switch>
                                        </div>
                                    }
                                </SocketContext.Consumer>

                            </SocketProvider>
                        </OrdersProvider>
                    </AssetsProvider>
                </StocksProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
