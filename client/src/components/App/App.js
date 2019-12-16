import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { AuthProvider } from '../../auth';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Navbar from '../Navbar/Navbar';
import Register from '../Register/Register';
import VSM from '../VSM/VSM';
import PrivateRoute from '../PrivateRoute';

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
                        <PrivateRoute path="/vsm">
                            <VSM />
                        </PrivateRoute>
                    </Switch>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
