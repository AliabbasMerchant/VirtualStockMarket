import axios from 'axios';
import React from 'react';
import {
    useHistory,
    Link
} from "react-router-dom";

import constants from '../constants';

function Register() {
    let history = useHistory();
    let nameRef = React.createRef();
    let passwordRef = React.createRef();
    let password2Ref = React.createRef();
    let usernameRef = React.createRef();

    function registerFunction() {
        axios.post(`${constants.DOMAIN}/register`, {
            name: nameRef.current.value,
            password: passwordRef.current.value,
            password2: password2Ref.current.value,
            username: usernameRef.current.value,
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
                            <input ref={nameRef} type="text" className="validate" name="name" required />
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="input-field my-3">
                            <input ref={usernameRef} type="text" className="validate" name="username" required />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="input-field my-3">
                            <input ref={passwordRef} type="password" className="validate" name="password" required />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="input-field my-3">
                            <input ref={password2Ref} type="password" className="validate" name="password2" required />
                            <label htmlFor="password2">Confirm Password</label>
                        </div>
                        <div onClick={registerFunction} className="waves-effect waves-light btn my-2">Register</div>
                        <br />
                        <Link className="btn my-2" to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
