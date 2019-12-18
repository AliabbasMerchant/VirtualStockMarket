import axios from 'axios';
import React from 'react';
import {
    useHistory,
    Link
} from "react-router-dom";
import { AuthContext } from '../contexts/auth';
import constants from '../constants';

function Login() {
    let history = useHistory();
    
    function login(context) {
        axios.post(`${constants.DOMAIN}/login`, {
            password: document.getElementById('password').value,
            username: document.getElementById('username').value,
        })
            .then(function (response) {
                response = response.data;
                if (response.ok) {
                    window.M.toast({ html: response.message, classes: "toast-success" });
                    context.login(response.userToken);
                    history.replace("/vsm");
                } else {
                    window.M.toast({ html: response.message, classes: "toast-error" });
                }
            })
            .catch(function (error) {
                console.log(error);
                window.M.toast({ html: "An error occurred while processing your request", classes: "toast-error" });
            });
    }
    
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
                                    <div onClick={() => login(context)} className="waves-effect waves-light btn my-2" id="login-button">Login</div>
                                    <br />
                                    <Link className="btn my-2" to="/register">Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </AuthContext.Consumer>
    );
}

export default Login;
