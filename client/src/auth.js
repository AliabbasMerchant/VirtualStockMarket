import React, { useState } from 'react';

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [userToken, setUserToken] = useState(null);
    return (
        <AuthContext.Provider value={{
            userToken,
            login: (cb) => {
                // TODO API Request
                // if ok, set Auth.userToken and cb(); and show "Successfully Logged In" Toast
                cb();
                setUserToken("fakeToken");
                // else show Toast "Error Logging You in"
            },
            isAuthenticated: () => {
                return userToken != null;
            },
            logout(cb) {
                // TODO API Request
                setUserToken(null);
                cb();
                // Toast "Successfully Logged Out"
            },
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };