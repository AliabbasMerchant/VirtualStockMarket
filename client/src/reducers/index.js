import { combineReducers } from 'redux';

import authReducer from './auth';
import fundsReducer from './funds';
import ordersReducer from './orders';
import stocksReducer from './stocks';
import socketReducer from './socket';

export default combineReducers({
    auth: authReducer,
    funds: fundsReducer,
    orders: ordersReducer,
    stocks: stocksReducer,
    socket: socketReducer
});
