import React from 'react';

const AuthContext = React.createContext();

class AuthProvider extends React.Component {
    state = {
        userToken: null
    }
    render() {
        return (
            <AuthContext.Provider value={{
                userToken: this.state,
                login: (cb) => {
                    // TODO API Request
                    // if ok, set Auth.userToken and cb(); and show "Successfully Logged In" Toast
                    cb();
                    this.setState({ userToken: "fakeToken" });
                    // else show Toast "Error Logging You in"
                },
                isAuthenticated: () => {
                    return this.state.userToken != null;
                },
                logout(cb) {
                    // TODO API Request
                    this.setState({ userToken: null });
                    cb();
                    // Toast "Successfully Logged Out"
                },
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export {AuthProvider, AuthContext};