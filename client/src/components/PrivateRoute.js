import React from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import { AuthContext } from '../contexts/auth';

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    // TODO: Show message via snackbar "Please login to view this page" if not logged in
    return (
        <AuthContext.Consumer>
            {(authContext) => {
                return (
                    <Route
                        {...rest}
                        render={({ location }) =>
                            authContext.getUserToken() ? (
                                children
                            ) : (
                                    <Redirect
                                        to={{
                                            pathname: "/login",
                                            state: { from: location }
                                        }}
                                    />
                                )
                        }
                    />
                )
            }}
        </AuthContext.Consumer>
    );
}

export default PrivateRoute;
