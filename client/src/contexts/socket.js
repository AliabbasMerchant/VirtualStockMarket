import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { AuthContext } from './auth';
import { StocksContext } from './stocks';
import { OrdersContext } from './orders';
import { AssetsContext } from './assets';

import constants from '../constants';

const SocketContext = React.createContext();

function SocketProvider(props) {
    let [socket] = useState(null);
    function connect() {
        if (socket === null) {
            socket = io(constants.DOMAIN);
        } else if (!socket.connected) {
            socket = io(constants.DOMAIN);
        }
    }
    function disconnect() {
        if (socket !== null) {
            if (socket.connected) {
                socket.disconnect();
            }
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
                                        authContext.getUserToken() ?
                                            <SocketContext.Provider value={{
                                                // TODO
                                            }}>
                                                {connect()}
                                                {props.children}
                                            </SocketContext.Provider>
                                            :
                                            <SocketContext.Provider value={{
                                                // TODO
                                            }}>
                                                {disconnect()}
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
