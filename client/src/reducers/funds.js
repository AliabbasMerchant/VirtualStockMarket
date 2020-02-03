import { createSlice } from '@reduxjs/toolkit';

let initialState = null;

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        fundsChange(state, action) {
            return typeof state == "number" ? state + action.payload : initialState;
        },
        setFunds(_state, action) {
            return typeof action.payload == "number" ? action.payload : initialState;
        },
        resetFunds(_state, _action) {
            return initialState;
        }
    }
});

export const { fundsChange, setFunds, resetFunds } = fundsSlice.actions;
export default fundsSlice.reducer;
