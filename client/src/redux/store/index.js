import { configureStore } from '@reduxjs/toolkit'
import rootReducer from "../reducers/index";
import authReducer from '../reducers/auth';

const rootReducer = combineReducers({
    authReducer
})

const store = configureStore({
    reducer: rootReducer
});

export default store;
