import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";

import { logoutUser } from '../reducers/auth';
import { disconnectSocket } from '../reducers/socket';


const Navbar = ({ loggedIn, logoutUser, disconnectSocket }) => {
    useEffect(() => {
        setTimeout(() => {
            if (document.querySelector('.sidenav'))
                new window.M.Sidenav(document.querySelector('.sidenav'));
        }, 1000);
    });
    // document.addEventListener('DOMContentLoaded', function () {
    //     new window.M.Sidenav(document.querySelector('.sidenav'));
    // })
    let list = <div>
        {loggedIn
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
                        onClick={() => { logoutUser(); disconnectSocket(); window.M.toast({ html: "Successfully Logged Out", classes: "toast-success" }); }}>
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

    return (
        <div id="appNavbar">
            <nav style={{ borderBottom: '1px solid grey', width: '100%' }} className="navbar navbar-fixed">
                <div className="nav-wrapper">
                    <Link className="brand-logo mx-3" to="/">Wallstreet</Link>
                    <div data-target="slide-out" className="sidenav-trigger hide-on-large-only" style={{ cursor: 'pointer' }}>
                        <i className="material-icons">menu</i>
                    </div>
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
};

const mapStateToProps = (state) => ({
    loggedIn: Boolean(state.auth)
});

const mapDispatchToProps = { logoutUser, disconnectSocket };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);
