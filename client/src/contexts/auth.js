import axios from 'axios';
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

    function initOnLogIn(userToken) {
        setUserToken(userToken);
        Cookies.set(constants.tokenCookieName, userToken);
        // changeStocks -> Server Call
        setFunds(constants.initialFunds);
        changePendingOrders([]);
        changeExecutedOrders([]);
    }

    function destroyOnLogout() {
        setUserToken(null);
        Cookies.remove(constants.tokenCookieName);
        // TODO
    }

    return (
        <AuthContext.Provider value={{
            loginFromLoginPage() {
                axios.post(`${constants.DOMAIN}/login`, {
                    password: document.getElementById('password').value,
                    username: document.getElementById('username').value,
                })
                    .then(function (response) {
                        response = response.data;
                        if (response.ok) {
                            window.M.toast({ html: response.message, classes: "toast-success" });
                            initOnLogIn(response.userToken);
                            history.replace("/vsm");
                        } else {
                            window.M.toast({ html: response.message, classes: "toast-error" });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        window.M.toast({ html: "An error occurred while processing your request", classes: "toast-error" });
                    });
            },
            logout() {
                destroyOnLogout();
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