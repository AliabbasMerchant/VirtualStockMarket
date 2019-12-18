import axios from 'axios';
import React from 'react';
import {
    useHistory,
} from "react-router-dom";

import constants from '../constants';

function Register() {
    let history = useHistory();
    function registerFunction() {
        axios.post(`${constants.DOMAIN}/register`, {
            name: document.getElementById('name').value,
            password: document.getElementById('password').value,
            password2: document.getElementById('password2').value,
            username: document.getElementById('username').value,
        })
            .then(function (response) {
                response = response.data;
                if (response.ok) {
                    window.M.toast({ html: response.message, classes: "toast-success" });
                    history.push("/login");
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
        <div className="my-3 mx-auto p-3 center container">
            <div className="row">
                <div className="mx-auto col s12 md10 lg8">
                    <div>
                        <h3 className="my-3">Register</h3>
                        <div className="input-field my-3">
                            <input id="name" type="text" className="validate" name="name" required />
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="input-field my-3">
                            <input id="username" type="text" className="validate" name="username" required />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="input-field my-3">
                            <input id="password" type="password" className="validate" name="password" required />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="input-field my-3">
                            <input id="password2" type="password" className="validate" name="password2" required />
                            <label htmlFor="password2">Confirm Password</label>
                        </div>
                        <div onClick={registerFunction} className="waves-effect waves-light btn my-2">Register</div>
                        <br />
                        <a href="/login" className="btn btn-outline-danger my-2">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
