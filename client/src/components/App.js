import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import Login from './Login';
import Main from './Main';
import Navbar from './Navbar';
import Portfolio from './Portfolio';
import PrivateRoute from './PrivateRoute';
import Register from './Register';
import Stock from './Stock';
import VSM from './VSM';

const App = () => {
    return (
        <Router>

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
                    <PrivateRoute path='/vsm/stock'>
                        <Stock />
                    </PrivateRoute>
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
