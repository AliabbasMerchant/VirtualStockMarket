import React, { useState } from 'react';
import io from 'socket.io-client';

import { AuthContext } from './auth';
import { StocksContext } from './stocks';
import { OrdersContext } from './orders';
import { AssetsContext } from './assets';

import constants from '../constants';

const SocketContext = React.createContext();

function SocketProvider(props) {
    let [socket] = useState(null);
    function connect(authContext, stocksContext, ordersContext, assetsContext) {
        if (socket === null || !socket.connected) {
            socket = io(constants.DOMAIN);
            socket.on('connect', () => {
                console.log("socketId", socket.id);
                socket.emit(constants.eventNewClient, { userToken: authContext.userToken });
            });
            socket.on(constants.eventStockRateUpdate, (data) => {
                stocksContext.updateStockRate(data.stockIndex, data.rate);
            });
            socket.on(constants.eventOrderPlaced, (data) => {
                console.log(constants.eventOrderPlaced, data);
            });
        }
    }
    function disconnect() {
        if (socket !== null && socket.connected) {
            socket.disconnect();
        }
    }
    return (
        <AuthContext.Consumer>
            {(authContext) =>
                <StocksContext.Consumer>
                    {(stocksContext) =>
                        <OrdersContext.Consumer>
                            {(ordersContext) =>
                                <AssetsContext.Consumer>
                                    {(assetsContext) =>
                                        <SocketContext.Provider value={{}}>
                                            {authContext.userToken ? connect(authContext, stocksContext, ordersContext, assetsContext) : disconnect()}
                                            {props.children}
                                        </SocketContext.Provider>
                                    }
                                </AssetsContext.Consumer>
                            }
                        </OrdersContext.Consumer>
                    }
                </StocksContext.Consumer>
            }
        </AuthContext.Consumer>
    )
}

export { SocketProvider, SocketContext };
