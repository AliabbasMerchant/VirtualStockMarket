import React from 'react';

import './Register.css';

function Register() {
    return (
        <div className="my-3 mx-auto p-3 center container">
            <div className="row">
                <div className="mx-auto col s12 md10 lg8">
                    <form action="/register" method="POST">
                        <h3 className="my-3">Register</h3>
                        <div className="input-field my-3">
                            <input id="username" type="text" className="validate" required />
                            <label for="username">Username</label>
                        </div>
                        <div className="input-field my-3">
                            <input id="password" type="password" className="validate" required />
                            <label for="password">Password</label>
                        </div>
                        <div className="input-field my-3">
                            <input id="password2" type="password" className="validate" required />
                            <label for="password2">Confirm Password</label>
                        </div>
                        <button type="submit" class="waves-effect waves-light btn my-2">Register</button>
                        <br />
                        <a href="/login" className="btn btn-outline-danger my-2">Login</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
