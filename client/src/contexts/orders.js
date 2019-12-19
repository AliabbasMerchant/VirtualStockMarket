import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const OrdersContext = React.createContext();

function OrdersProvider(props) {
    const [executedOrders, setExecutedOrders] = useState(null);
    const [pendingOrders, setPendingOrders] = useState(null);

    return (
        <AuthContext.Consumer>
            {(authContext) =>
                authContext.getUserToken() ?
                    <OrdersContext.Provider value={{
                        getExecutedOrders() {
                            if (executedOrders == null) {
                                // axios call
                                // setExecutedOrders
                            }
                            return executedOrders;
                        },
                        getPendingOrders() {
                            if (pendingOrders == null) {
                                // axios call
                                // setPendingOrders
                            }
                            return pendingOrders;
                        },
                        placeOrder(order) {
                            pendingOrders.push(order);
                            setPendingOrders(pendingOrders);
                            return true;
                        },
                        orderIsExecuted(order) {
                            executedOrders.push(order);
                            setExecutedOrders(executedOrders);
                            let newPendingOrders = [];
                            for (let i = 0; i < pendingOrders.length; i++) {
                                if (pendingOrders[i].id == order.id) {
                                    pendingOrders[i].quantity -= order.quantity;
                                    if (pendingOrders[i].quantity != 0) {
                                        newPendingOrders.push(pendingOrders[i]);
                                    }
                                } else {
                                    newPendingOrders.push(pendingOrders[i]);
                                }
                            }
                            setPendingOrders(newPendingOrders);
                        },
                        getHoldings() {
                            let holdings = [];
                            executedOrders.forEach(order => {
                                let found = false;
                                holdings.forEach(holding => {
                                    if (holding.stockId == order.stockId) {
                                        found = true;
                                        if ((holding.quantity + order.quantity) != 0) {
                                            holding.rate = (holding.rate * holding.quantity + order.rate * order.quantity) / (holding.quantity + order.quantity);
                                        } else {
                                            holding.rate = 0;;
                                        }
                                        holding.quantity += order.quantity;
                                    }
                                })
                                if (!found) {
                                    holdings.push({ stockId: order.stockId, rate: order.rate, quantity: order.quantity });
                                }
                            });
                            holdings = holdings.filter(holding => {
                                return holding.quantity != 0;
                            })
                            holdings.forEach(holding => {
                                holding.price = holding.rate * holding.quantity;
                            });
                            return holdings;
                        }
                    }}>
                        {props.children}
                    </OrdersContext.Provider>
                    :
                    <OrdersContext.Provider value={{
                        getExecutedOrders() {
                            return null;
                        },
                        getPendingOrders() {
                            return null;
                        },
                        placeOrder() {
                            return false;
                        },
                        orderIsExecuted() {
                            return false;
                        },
                        getHoldings() {
                            return null;
                        }
                    }}>
                        {setPendingOrders(null)}
                        {setExecutedOrders(null)}
                        {props.children}
                    </OrdersContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { OrdersProvider, OrdersContext };