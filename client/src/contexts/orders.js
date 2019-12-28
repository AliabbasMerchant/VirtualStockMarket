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
                            let p = pendingOrders.filter(_ => true);
                            let e = executedOrders.filter(_ => true);
                            console.log("orderIsExecuted", p, e);
                            let newPendingOrders = [];
                            for (let i = 0; i < p.length; i++) {
                                if (p[i].orderId === orderId) {
                                    e = e.concat({ ...p[i], quantity });
                                    console.log("exec", e);
                                    setExecutedOrders([...e]);
                                    p[i].quantity -= quantity;
                                    if (p[i].quantity !== 0) {
                                        newPendingOrders.concat(p[i]);
                                    }
                                } else {
                                    newPendingOrders.concat(p[i]);
                                }
                            }
                            setPendingOrders([...newPendingOrders]);
                            console.log("orderIsExecuted End", p, e);
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