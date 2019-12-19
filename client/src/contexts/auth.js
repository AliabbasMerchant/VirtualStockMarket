import React, { useState } from 'react';
import Cookies from 'js-cookie';

import getUserIdFromToken from '../helpers';
import constants from '../constants';

const AuthContext = React.createContext();

function AuthProvider(props) {
    let token = Cookies.get(constants.tokenCookieName) ? Cookies.get(constants.tokenCookieName) : null;
    const [userToken, setUserToken] = useState(token);

    return (
        <AuthContext.Provider value={{
            login(userToken) {
                setUserToken(userToken);
                Cookies.set(constants.tokenCookieName, userToken);
            },
            logout() {
                setUserToken(null);
                Cookies.remove(constants.tokenCookieName);
            },
            getUserToken() {
                return userToken;
            },
            /* getUserId() {
                if (!userToken) return null;
                return getUserIdFromToken(userToken);
            },
            */
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };