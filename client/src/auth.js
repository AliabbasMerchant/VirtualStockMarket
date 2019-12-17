import axios from 'axios';
import React, { useState } from 'react';
import {
    useHistory,
} from "react-router-dom";
const { getUserIdFromToken } = require('./helpers');
const constants = require('./constants');

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [userToken, setUserToken] = useState(null);
    let history = useHistory();
    return (
        <AuthContext.Provider value={{
            getUserToken() {
                return userToken;
            },
            logout() {
                setUserToken(null);
            },
            getUserId() {
                if (!userToken) return null;
                return getUserIdFromToken(userToken);
            },
            async loginFromLoginPage() {
                axios.post(`${constants.DOMAIN}/login`, {
                    password: document.getElementById('password').value,
                    username: document.getElementById('username').value,
                })
                    .then(function (response) {
                        response = response.data;
                        if (response.ok) {
                            window.M.toast({ html: response.message, classes: "toast-success" });
                            setUserToken(response.userToken);
                            history.replace("/vsm");
                        } else {
                            window.M.toast({ html: response.message, classes: "toast-error" });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        window.M.toast({ html: "An error occurred while processing your request", classes: "toast-error" });
                    });
            }
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };