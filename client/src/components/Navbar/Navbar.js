import React, { useEffect, useState } from 'react';
import {
    Link,
    useHistory
} from "react-router-dom";
import { AuthContext } from '../../auth';
import './Navbar.css';

function Navbar() {
    document.addEventListener('DOMContentLoaded', function () {
        let elem = document.querySelector('.sidenav');
        new window.M.Sidenav(elem);
    });
    let history = useHistory();
    let list = <AuthContext.Consumer>
        {(context) => (
            <div>
                {context.isAuthenticated()
                    ? <ul>
                        <li>
                            <Link className="sidenav-close" to="/">About</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/vsm">VSM</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/vsm/portfolio">My Portfolio</Link>
                        </li>
                        <li>
                            <Link className="sidenav-close" to="/vsm/orders">My Orders</Link>
                        </li>
                        <li>
                            <a onClick={() => context.logout(() => history.push("/"))} className='mr-3 sidenav-close'>Logout</a>
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
                    <a href="/" className="brand-logo mx-3">VSM</a>
                    <a href="#" data-target="slide-out" className="sidenav-trigger hide-on-large-only"><i className="material-icons">menu</i></a>
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
