import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const OrdersContext = React.createContext();

function OrdersProvider(props) {
    let [executedOrders, setExecutedOrders] = useState([]);
    let [pendingOrders, setPendingOrders] = useState([]);
    let [got, setGot] = useState(false);

    console.log("PO", pendingOrders);
    console.log("EO", executedOrders);

    function initOrders(authContext) {
        if (!got) {
            setGot(true);
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
                        placeOrder(order) { // perfect
                            let p = pendingOrders.concat(order);
                            setPendingOrders([...p]);
                            return true;
                        },
                        deletePendingOrder(orderId) { // perfect
                            let p = pendingOrders.filter(pendingOrder =>
                                pendingOrder.orderId !== orderId
                            );
                            setPendingOrders([...p]);
                            return true;
                        },
                        orderIsExecuted(orderId, quantity) {
                            console.log("orderIsExecuted", pendingOrders, executedOrders);
                            let newPendingOrders = [];
                            for (let i = 0; i < pendingOrders.length; i++) {
                                if (pendingOrders[i].orderId === orderId) {
                                    let e = executedOrders.concat({ ...pendingOrders[i], quantity });
                                    console.log("exec", e);
                                    setExecutedOrders([...e]);
                                    pendingOrders[i].quantity -= quantity;
                                    if (pendingOrders[i].quantity !== 0) {
                                        newPendingOrders.concat(pendingOrders[i]);
                                    }
                                } else {
                                    newPendingOrders.concat(pendingOrders[i]);
                                }
                            }
                            setPendingOrders([...newPendingOrders]);
                            console.log("orderIsExecuted End", pendingOrders, executedOrders);
                        },
                        getHoldings() {
                            let holdings = {}; // stockIndex -> holding
                            executedOrders.forEach(order => {
                                let stockIndex = order.stockIndex;
                                if (!holdings[stockIndex]) {
                                    holdings[stockIndex] = { stockIndex, rate: 0, quantity: 0 }
                                }
                                let holding = holdings[stockIndex];
                                let quantity = holding.quantity + order.quantity;
                                if (quantity !== 0) {
                                    holding.rate = (holding.rate * holding.quantity + order.rate * order.quantity) / quantity;
                                } else {
                                    holding.rate = 0;
                                }
                                holding.quantity = quantity;
                            });

                            let holdingsArray = [];
                            Object.values(holdings).forEach(holding => {
                                if (holding.quantity !== 0) {
                                    holding.rate = Math.abs(holding.rate);
                                    holding.quantity = Math.abs(holding.quantity);
                                    holding.price = holding.rate * holding.quantity;
                                    holdingsArray.push(holding);
                                }
                            });
                            return holdingsArray;
                        }
                    }}>
                        {initOrders(authContext)}
                        {props.children}
                    </OrdersContext.Provider>
                    :
                    <OrdersContext.Provider value={{
                        executedOrders: [],
                        pendingOrders: [],
                        placeOrder(_order) {
                            return false;
                        },
                        orderIsExecuted(_order) { },
                        getHoldings() { }
                    }}>
                        {/* {pendingOrders = []}
                        {setPendingOrders([])}
                        {executedOrders = []}
                        {setExecutedOrders([])} */}
                        {/* {setGot(true)} */}
                        {props.children}
                    </OrdersContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { OrdersProvider, OrdersContext };