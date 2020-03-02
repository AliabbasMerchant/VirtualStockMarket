import React from 'react';
import {
    Link
} from "react-router-dom";

function Main() {
    return (
        <div className="my-3 mx-auto p-3 center container">
            <div className="row">
                <div className="mx-auto col s12 md10 lg8">
                    <h2>Wallstreet</h2>
                    <img src="/wallstreet/ecell.jpg" alt="ECell VJTI" />
                    <br />
                    <Link className="btn my-3" to="/login">Login</Link>
                    <br />
                    <Link className="btn my-3" to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Main;
