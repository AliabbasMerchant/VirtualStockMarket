import { createSlice } from '@reduxjs/toolkit';

let initialState = [];

const stocksSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        updateStockRate: (state, action) => { // TODO BREAKS!
            const { id, newRate } = action.payload;
            let s = {...state[id]};
            s.prevRate = s.rate;
            s.rate = newRate;
            return [...state.slice(0, id), s, ...state.slice(id + 1)];
        },
        setStocks(_state, action) {
            return action.payload;
        },
        resetStocks(_state, _action) {
            return initialState;
        }
    }
});

export const { updateStockRate, setStocks, resetStocks } = stocksSlice.actions;
export default stocksSlice.reducer;
