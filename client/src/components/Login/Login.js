import React from 'react';
import {
    useHistory,
} from "react-router-dom";
import { AuthContext } from '../../auth';
import './Login.css';

function Login() {
    let history = useHistory();
    return (
        <AuthContext.Consumer>
            {(context) => 
                context.getUserToken() ?
                    history.replace("/vsm")
                    :
                    <div className="my-3 mx-auto p-3 center container">
                        <div className="row">
                            <div className="mx-auto col s12 md10 lg8">
                                <div>
                                    <h3 className="my-3">Login</h3>
                                    <div className="input-field my-3">
                                        <input id="username" type="text" className="validate" name="username" required />
                                        <label htmlFor="username">Username</label>
                                    </div>
                                    <div className="input-field my-3">
                                        <input id="password" type="password" className="validate" name="password" required />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <div onClick={context.loginFromLoginPage} className="waves-effect waves-light btn my-2" id="login-button">Login</div>
                                    <br />
                                    <a href="/register" className="btn btn-outline-danger my-2">Register</a>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </AuthContext.Consumer>
    );
}

export default Login;
