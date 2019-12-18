import React, { useState } from 'react';
import {
    useHistory,
} from "react-router-dom";
import Cookies from 'js-cookie';

import getUserIdFromToken from '../helpers';
import constants from '../constants';

const AuthContext = React.createContext();

function AuthProvider(props) {
    let token = Cookies.get(constants.tokenCookieName) ? Cookies.get(constants.tokenCookieName) : null;
    const [userToken, setUserToken] = useState(token);

    const history = useHistory();

    const [stocks, changeStocks] = useState(null);
    const [executedOrders, changeExecutedOrders] = useState(null);
    const [pendingOrders, changePendingOrders] = useState(null);
    const [funds, setFunds] = useState(null);


    return (
        <AuthContext.Provider value={{
            login(userToken) {
                setUserToken(userToken);
                Cookies.set(constants.tokenCookieName, userToken);
                // changeStocks -> Server Call
                setFunds(constants.initialFunds);
                changePendingOrders([]);
                changeExecutedOrders([]);
            },
            logout() {
                setUserToken(null);
                Cookies.remove(constants.tokenCookieName);
                // TODO
            },
            getUserToken() {
                return userToken;
            },
            getUserId() {
                if (!userToken) return null;
                return getUserIdFromToken(userToken);
            },

            getFunds() {
                return funds;
            },
            changeFunds(newFunds) {
                if (!userToken) return false;
                setFunds(newFunds);
                return true;
            }
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };