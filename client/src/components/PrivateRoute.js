import React from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import { AuthContext } from '../auth';


// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    // TODO: Show message via snackbar "Please login to view this page" if not logged in
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <Route
                        {...rest}
                        render={({ location }) =>
                            context.isAuthenticated() ? (
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
