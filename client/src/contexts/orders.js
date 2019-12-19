import axios from 'axios';
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
                                axios.post(`${constants.DOMAIN}/getExecutedOrders`, {
                                    userToken: authContext.getUserToken(),
                                })
                                    .then(function (response) {
                                        response = response.data;
                                        if (response.ok) {
                                            executedOrders = response.executedOrders;
                                            setExecutedOrders(executedOrders);
                                        } else {
                                            console.log(response.message);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                            return executedOrders;
                        },
                        getPendingOrders() {
                            if (pendingOrders == null) {
                                axios.post(`${constants.DOMAIN}/getPendingOrders`, {
                                    userToken: authContext.getUserToken(),
                                })
                                    .then(function (response) {
                                        response = response.data;
                                        if (response.ok) {
                                            pendingOrders = response.pendingOrders;
                                            setPendingOrders(pendingOrders);
                                        } else {
                                            console.log(response.message);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
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
                                    if (pendingOrders[i].quantity !== 0) {
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
                            for (let i = 0; i < executedOrders.length; i++) {
                                let found = false;
                                let order = executedOrders[i];
                                for (let j = 0; j < holdings.length; j++) {
                                    let holding = holdings[j];
                                    if (holding.stockId === order.stockId) {
                                        found = true;
                                        if ((holding.quantity + order.quantity) !== 0) {
                                            holding.rate = (holding.rate * holding.quantity + order.rate * order.quantity) / (holding.quantity + order.quantity);
                                        } else {
                                            holding.rate = 0;;
                                        }
                                        holding.quantity += order.quantity;
                                    }
                                }
                                if (!found) {
                                    holdings.push({ stockId: order.stockId, rate: order.rate, quantity: order.quantity });
                                }
                            }
                            holdings = holdings.filter(holding => {
                                return holding.quantity !== 0;
                            })
                            for(let i=0;i<holdings.length;i++) {
                                holdings[i].price = holdings[i].rate * holdings[i].quantity;
                            };
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