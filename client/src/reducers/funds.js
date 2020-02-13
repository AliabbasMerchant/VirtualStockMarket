import { createSlice } from '@reduxjs/toolkit';

let initialState = null;

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        setFunds(_state, action) {
            return isNaN(Number(action.payload)) ? initialState : Number(action.payload);
        },
        resetFunds(_state, _action) {
            return initialState;
        }
    }
});

export const { setFunds, resetFunds } = fundsSlice.actions;
export default fundsSlice.reducer;
