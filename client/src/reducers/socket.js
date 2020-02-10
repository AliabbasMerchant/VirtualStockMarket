import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';

import constants from '../constants';
import { fundsChange } from './funds';
import { orderIsExecuted, deletePendingOrder } from './orders';
import { updateStockRate } from './stocks';

let socket = null;

let initialState = false;
const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connect(_state, _action) {
            return true;
        },
        disconnect(_state, _action) {
            return false;
        },
    }
});

const { connect, disconnect } = socketSlice.actions;

export const connectSocket = (userToken) => {
    return (dispatch) => {
        if (socket === null || !socket.connected) {
            socket = io(constants.WEBSOCKET_DOMAIN);
            socket.on('connect', () => {
                dispatch(connect());
                socket.emit(constants.eventNewClient, { userToken });
            });
            socket.on(constants.eventStockRateUpdate, (data) => {
                console.log(constants.eventStockRateUpdate, data);
                dispatch(updateStockRate({ id: Number(data.stockIndex), newRate: Number(data.rate) }));
            });
            socket.on(constants.eventOrderPlaced, (data) => {
                console.log(constants.eventOrderPlaced, data);
                if (data.ok) {
                    window.M.toast({ html: "Pending Order Successfully Executed", classes: "toast-success" });
                    dispatch(orderIsExecuted({ orderId: data.orderId, quantity: Number(data.quantity) }));
                    dispatch(fundsChange(Number(data.fundsChange)));
                } else {
                    dispatch(deletePendingOrder(data.orderId));
                    window.M.toast({ html: data.message, classes: "toast-error" });
                }
            });
        }
    };
};

export const disconnectSocket = () => {
    return (dispatch) => {
        if (socket !== null && socket.connected) {
            socket.disconnect();
        }
        dispatch(disconnect());
    };
};

export default socketSlice.reducer;
