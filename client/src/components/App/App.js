import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { AuthContext, AuthProvider } from '../../auth';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Navbar from '../Navbar/Navbar';
import Orders from '../Orders/Orders';
import Portfolio from '../Portfolio/Portfolio';
import Register from '../Register/Register';
import Stock from '../Stock/Stock';
import VSM from '../VSM/VSM';

import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
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
                        <PrivateRoute path="/home">
                            <VSM />
                        </PrivateRoute>
                        <PrivateRoute path="/portfolio">
                            <Portfolio />
                        </PrivateRoute>
                        <PrivateRoute path="/orders">
                            <Orders />
                        </PrivateRoute>
                        <PrivateRoute path="/stock">
                            <Stock />
                        </PrivateRoute>
                    </Switch>
                </div>
            </AuthProvider>
        </Router>
    );
}

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    // TODO: Show message via snackbar "Please login to view this page" if not logged in
    return (
        <AuthContext.Consumer>
            {(context) => (
                <Route
                    {...rest}
                    render={({ location }) =>
                        context.isAuthenticated() ? (
                            children
                        ) : (
                                <Redirect
                                    to={{
                                        pathname: "/login",
                                        state: { from: location }
                                    }}
                                />
                            )
                    }
                />
            )}
        </AuthContext.Consumer>
    );
}

export default App;
