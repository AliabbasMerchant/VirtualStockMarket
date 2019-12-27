import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const OrdersContext = React.createContext();

function OrdersProvider(props) {
    let [executedOrders, setExecutedOrders] = useState(null);
    let [pendingOrders, setPendingOrders] = useState(null);

    function initOrders(authContext) {
        if (executedOrders == null) {
            axios.post(`${constants.DOMAIN}/getExecutedOrders`, {
                userToken: authContext.userToken,
            })
                .then(function (response) {
                    response = response.data;
                    console.log("getExecutedOrders", response);
                    if (response.ok) {
                        executedOrders = response.executedOrders;
                        setExecutedOrders([...response.executedOrders]);
                    } else {
                        console.log("getExecutedOrders Error", response.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        if (pendingOrders == null) {
            axios.post(`${constants.DOMAIN}/getPendingOrders`, {
                userToken: authContext.userToken,
            })
                .then(function (response) {
                    response = response.data;
                    console.log("getPendingOrders", response);
                    if (response.ok) {
                        pendingOrders = response.pendingOrders;
                        setPendingOrders([...response.pendingOrders]);
                    } else {
                        console.log("getPendingOrders Error", response.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return (
        <AuthContext.Consumer>
            {(authContext) =>
                authContext.userToken ?
                    <OrdersContext.Provider value={{
                        executedOrders,
                        pendingOrders,
                        placeOrder(order) {
                            pendingOrders.concat(order);
                            setPendingOrders([...pendingOrders]);
                            return true;
                        },
                        orderIsExecuted(order) {
                            executedOrders.concat(order);
                            setExecutedOrders([...executedOrders]);
                            let newPendingOrders = [];
                            for (let i = 0; i < pendingOrders.length; i++) {
                                if (pendingOrders[i].id === order.id) {
                                    pendingOrders[i].quantity -= order.quantity;
                                    if (pendingOrders[i].quantity !== 0) {
                                        newPendingOrders.push(pendingOrders[i]);
                                    }
                                } else {
                                    newPendingOrders.push(pendingOrders[i]);
                                }
                            }
                            setPendingOrders([...newPendingOrders]);
                        },
                        getHoldings() {
                            let holdings = [];
                            for (let i = 0; i < executedOrders.length; i++) {
                                let found = false;
                                let order = executedOrders[i];
                                for (let j = 0; j < holdings.length; j++) {
                                    let holding = holdings[j];
                                    if (holding.stockIndex === order.stockIndex) {
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
                                    holdings.push({ stockIndex: order.stockIndex, rate: order.rate, quantity: order.quantity });
                                }
                            }
                            holdings = holdings.filter(holding => {
                                return holding.quantity !== 0;
                            })
                            for (let i = 0; i < holdings.length; i++) {
                                holdings[i].price = holdings[i].rate * holdings[i].quantity;
                            };
                            return holdings;
                        }
                    }}>
                        {initOrders(authContext)}
                        {props.children}
                    </OrdersContext.Provider>
                    :
                    <OrdersContext.Provider value={{
                        executedOrders: null,
                        pendingOrders: null,
                        placeOrder(order) {
                            return false;
                        },
                        orderIsExecuted(_order) { },
                        getHoldings() { }
                    }}>
                        {pendingOrders = null}
                        {setPendingOrders(null)}
                        {executedOrders = null}
                        {setExecutedOrders(null)}
                        {props.children}
                    </OrdersContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { OrdersProvider, OrdersContext };