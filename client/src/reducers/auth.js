import Cookies from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import constants from '../constants';
import { setFunds, resetFunds } from './funds';
import { setPendingOrders, setExecutedOrders, resetOrders } from './orders'

let initialState = Cookies.get(constants.tokenCookieName);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(_state, action) {
            let userToken = action.payload;
            Cookies.set(constants.tokenCookieName, userToken);
            return userToken;
        },
        logout(_state, action) {
            Cookies.remove(constants.tokenCookieName);
            return null;
        },
    }
});

const { login, logout } = authSlice.actions;

export const loginUser = (userToken) => {
    return function (dispatch) {
        dispatch(login(userToken));
        
        axios.post(`${constants.DOMAIN}/getFunds`, { userToken, })
            .then((response) => {
                response = response.data;
                console.log("getFunds", response);
                if (response.ok) {
                    dispatch(setFunds(response.funds));
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.post(`${constants.DOMAIN}/getExecutedOrders`, { userToken })
            .then(function (response) {
                response = response.data;
                console.log("getExecutedOrders", response);
                if (response.ok) {
                    dispatch(setExecutedOrders(response.executedOrders));
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.post(`${constants.DOMAIN}/getPendingOrders`, { userToken })
            .then(function (response) {
                response = response.data;
                console.log("getPendingOrders", response);
                if (response.ok) {
                    dispatch(setPendingOrders(response.pendingOrders));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
};

export const logoutUser = () => {
    return function (dispatch) {
        dispatch(logout());
        dispatch(resetFunds());
        dispatch(resetOrders());
    };
};

export default authSlice.reducer;
