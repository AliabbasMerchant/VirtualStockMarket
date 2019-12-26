import React, { useState } from 'react';
import Cookies from 'js-cookie';

import constants from '../constants';

const AuthContext = React.createContext();

function AuthProvider(props) {
    let token = Cookies.get(constants.tokenCookieName) ? Cookies.get(constants.tokenCookieName) : null;
    const [userToken, setUserToken] = useState(token);

    return (
        <AuthContext.Provider value={{
            userToken,
            login(userToken) {
                setUserToken(userToken);
                Cookies.set(constants.tokenCookieName, userToken);
            },
            logout() {
                setUserToken(null);
                Cookies.remove(constants.tokenCookieName);
            },
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };