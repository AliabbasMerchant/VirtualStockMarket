import React from 'react';
import {
    Link,
    useHistory
} from "react-router-dom";
import { AuthContext } from '../../auth';
import './Navbar.css';

class Navbar extends React.Component {
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function () {
            var elem = document.querySelector('.sidenav');
            new window.M.Sidenav(elem);
        });
    }
    render() {
        let history = useHistory();
        let list = <AuthContext.Consumer>
            {(context) => (
                <div>
                    {context.isAuthenticated()
                        ? <ul>
                            <li>
                                <Link to="/">About</Link>
                            </li>
                            <li>
                                <Link to="/home">VSM</Link>
                            </li>
                            <li>
                                <Link to="/portfolio">My Portfolio</Link>
                            </li>
                            <li>
                                <Link to="/orders">My Orders</Link>
                            </li>
                            <li>
                                <div onclick={() => context.logout(() => history.push("/"))} className='mx-3'>Logout</div>
                            </li>
                        </ul>
                        : <ul>
                            <li>
                                <Link to="/">About</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
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
}

export default Navbar;
