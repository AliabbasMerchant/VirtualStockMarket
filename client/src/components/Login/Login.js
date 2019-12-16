import React from 'react';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import { AuthContext } from '../../auth';
import './Login.css';

function Login() {
    let history = useHistory();
    let location = useLocation();
    // let { from } = location.state || { from: { pathname: "/" } };
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    context.isAuthenticated() ?
                        history.replace("/vsm")
                        :
                        <div className="my-3 mx-auto p-3 center container">
                            <div className="row">
                                <div className="mx-auto col s12 md10 lg8">
                                    <form action="/login" method="POST">
                                        <h3 className="my-3">Login</h3>
                                        <div className="input-field my-3">
                                            <input id="username" type="text" className="validate" required/>
                                            <label for="username">Username</label>
                                        </div>
                                        <div className="input-field my-3">
                                            <input id="password" type="password" className="validate" required/>
                                            <label for="password">Password</label>
                                        </div>
                                        <button type="submit" class="waves-effect waves-light btn my-2">Login</button>
                                        <br/>
                                        <a href="/register" className="btn btn-outline-danger my-2">Register</a>
                                    </form>
                                </div>
                            </div>
                            <button onClick={() => {
                                context.login(() => {
                                    history.replace("/vsm");
                                    {/*  history.replace(from); 
                                    history.push("/vsm");  */}
                                });
                            }}>Log in</button>
                        </div>
                )
            }
            }
        </AuthContext.Consumer>
    );
}

export default Login;
