import React from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import { connect } from 'react-redux'

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
const PrivateRoute = ({ children, loggedIn, ...rest }) => {
    // TODO: Show message via snackbar "Please login to view this page" if not logged in
    return (
        <Route
            {...rest}
            render={({ location }) =>
                loggedIn ? (
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
    );
}

const mapStateToProps = (state) => ({
    loggedIn: Boolean(state.auth)
});

export default connect(
    mapStateToProps,
    null
)(PrivateRoute);
