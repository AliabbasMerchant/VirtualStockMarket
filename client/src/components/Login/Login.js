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
    let { from } = location.state || { from: { pathname: "/" } };
    return (
        // TODO
        <AuthContext.Consumer>
            {(context) => (
                <div>
                    <button onClick={() => {
                        context.login(() => {
                            history.replace(from);
                        });
                    }}>Log in</button>
                </div>
            )
            }
        </AuthContext.Consumer>
    );
}

export default Login;
