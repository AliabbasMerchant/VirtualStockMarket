import { createSlice } from '@reduxjs/toolkit';

let initialState = [];

const stocksSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        updateStockRate: (state, action) => {
            try {
                const { stockIndex, newRate, time } = action.payload;
                let s = { ...state[stockIndex] };
                if (newRate !== s.rate) {
                    s.prevRate = s.rate;
                    s.rate = newRate;
                }
                s.ratesObject = { ...s.ratesObject, [time]: newRate };
                return [...state.slice(0, stockIndex), s, ...state.slice(stockIndex + 1)];
            } catch (err) {
                console.log('updateStockRate', err);
                return state;
            }
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
