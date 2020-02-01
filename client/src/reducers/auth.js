import Cookies from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit'

import constants from '../constants';

const authSlice = createSlice({
    name: 'auth',
    initialState: Cookies.get(constants.tokenCookieName) ? Cookies.get(constants.tokenCookieName) : null,
    reducers: {
        loginUser(_state, action) {
            let userToken = action.payload;
            Cookies.set(constants.tokenCookieName, userToken);
            return userToken;
        },
        logoutUser(_state) {
            Cookies.remove(constants.tokenCookieName);
            return null;
        },
    }
})

export const { loginUser, logoutUser } = authSlice.actions
export default authSlice.reducer
