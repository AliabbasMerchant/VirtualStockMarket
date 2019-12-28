import React, { useEffect } from 'react';
import {
    Link,
} from "react-router-dom";
import { AuthContext } from '../contexts/auth';

function Navbar() {
    useEffect(() => {
        setTimeout(() => {
            if (document.querySelector('.sidenav'))
                new window.M.Sidenav(document.querySelector('.sidenav'));
        }, 5000);
    });
    // document.addEventListener('DOMContentLoaded', function () {
    //     new window.M.Sidenav(document.querySelector('.sidenav'));
    // })
    let list = <AuthContext.Consumer>
        {(authContext) => (
            <div>
                {authContext.userToken
                    ? <ul>
                        <li>
                            <Link className="sidenav-close" to="/">About</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/vsm">Wallstreet</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/vsm/portfolio">My Portfolio</Link>
                        </li>
                        <li>
                            <Link
                                className='mr-3 sidenav-close' to="/login"
                                onClick={() => { authContext.logout(); window.M.toast({ html: "Successfully Logged Out", classes: "toast-success" }); }}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                    : <ul>
                        <li>
                            <Link className="sidenav-close" to="/">About</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/login">Login</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/register">Register</Link>
                        </li>
                    </ul>
                }
            </div>
        )
        }
    </AuthContext.Consumer>

    return (
        <div id="appNavbar">
            <nav style={{ borderBottom: '1px solid grey' }} className="navbar navbar-fixed">
                <div className="nav-wrapper">
                    <Link className="brand-logo mx-3" to="/">Wallstreet</Link>
                    <div data-target="slide-out" className="sidenav-trigger hide-on-large-only"><i className="material-icons">menu</i></div>
                    <div className="right hide-on-med-and-down">
                        {list}
                    </div>
                </div>
            </nav>
            <div className="sidenav" id="slide-out">
                {list}
            </div>
        </div>
    );
}

export default Navbar;
