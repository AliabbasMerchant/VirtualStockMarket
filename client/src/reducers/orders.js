import { createSlice } from '@reduxjs/toolkit';

let initialState = { executedOrders: [], pendingOrders: [] };

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        placeOrder(state, action) {
            const order = action.payload;
            return Object.assign({}, state, {
                pendingOrders: [...state.pendingOrders, order]
            });
        },
        deletePendingOrder(state, action) { // Try Catch not required
            const orderId = action.payload
            return Object.assign({}, state, {
                pendingOrders: state.pendingOrders.filter(pendingOrder =>
                    pendingOrder.orderId !== orderId
                )
            });
        },
        orderIsExecuted(state, action) {
            try {
                const { orderId, quantity } = action.payload;
                let newPendingOrders = [];
                let executedOrder;
                for (let i = 0; i < state.pendingOrders.length; i++) {
                    let temp = { ...state.pendingOrders[i] };
                    if (temp.orderId === orderId) {
                        executedOrder = { ...temp, quantity };
                        temp.quantity -= quantity;
                        if (temp.quantity !== 0) {
                            newPendingOrders.concat(temp);
                        }
                    } else {
                        newPendingOrders.concat(temp);
                    }
                }
                return Object.assign({}, state, {
                    executedOrders: [...state.executedOrders, executedOrder],
                    pendingOrders: [...newPendingOrders],
                });
            } catch (err) {
                console.log('orderIsExecuted', err);
                return state;
            }
        },
        setPendingOrders(state, action) {
            return Object.assign({}, state, {
                pendingOrders: [...action.payload]
            });
        },
        setExecutedOrders(state, action) {
            return Object.assign({}, state, {
                executedOrders: [...action.payload]
            });
        },
        resetOrders(_state, _action) {
            return initialState;
        }
    }
});

export const { placeOrder, deletePendingOrder, orderIsExecuted, setPendingOrders, setExecutedOrders, resetOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
