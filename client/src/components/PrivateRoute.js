import React from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import { connect } from 'react-redux';
import { loginUser } from '../reducers/auth';
import { connectSocket } from '../reducers/socket';

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
const PrivateRoute = ({ children, userToken, socketConnected, loginUser, connectSocket, ...rest }) => {
    // TODO: Show message via snackbar "Please login to view this page" if not logged in
    function connectToServer() {
        if(socketConnected) {
            // we have already connected to the server
        } else {
            loginUser(userToken);
            connectSocket(userToken);
        }
    };
    connectToServer();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                userToken ? (
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
    userToken: state.auth,
    socketConnected: state.socket
});

const mapDispatchToProps = { loginUser, connectSocket };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivateRoute);
