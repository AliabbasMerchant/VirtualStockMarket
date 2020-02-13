import { createSlice } from '@reduxjs/toolkit';

let initialState = null;

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        fundsChange(state, action) {
            try {
                return typeof state === "number" || typeof state === "string" ? Number(state) + Number(action.payload) : initialState;
            } catch (err) {
                return state;
            }
        },
        setFunds(_state, action) {
            return isNaN(Number(action.payload)) ? initialState : Number(action.payload);
        },
        resetFunds(_state, _action) {
            return initialState;
        }
    }
});

export const { fundsChange, setFunds, resetFunds } = fundsSlice.actions;
export default fundsSlice.reducer;
