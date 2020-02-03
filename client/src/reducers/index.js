import { combineReducers } from 'redux';

import authReducer from './auth';
import fundsReducer from './funds';
import ordersReducer from './orders';

export default combineReducers({
    auth: authReducer,
    funds: fundsReducer,
    orders: ordersReducer
});
