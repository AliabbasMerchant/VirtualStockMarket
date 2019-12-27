import Cookies from 'js-cookie';

const constants = require('../../constants');
const actions = require('../actions');

const authReducer = createReducer("", {
    [actions.loginAction]: (_state, action) => {
        let userToken = action.payload;
        Cookies.set(constants.tokenCookieName, userToken);
        return userToken;
    },
    [actions.logout]: (_state) => {
        Cookies.remove(constants.tokenCookieName);
        return "";
    }
});

export default authReducer;