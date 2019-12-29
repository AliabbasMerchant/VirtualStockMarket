import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const OrdersContext = React.createContext();

function OrdersProvider(props) {
    let [executedOrders, setExecutedOrders] = useState([]);
    let [pendingOrders, setPendingOrders] = useState([]);
    let [got, setGot] = useState(false);

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
                        // executedOrders = response.executedOrders;
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
                            setPendingOrders(pendingOrders => [...pendingOrders.concat(order)]);
                            {/* let p = pendingOrders.concat(order);
                            setPendingOrders([...p]);
                            return true; */}
                        },
                        deletePendingOrder(orderId) { // perfect
                            setPendingOrders(pendingOrders => {
                                let p = pendingOrders.filter(pendingOrder =>
                                    pendingOrder.orderId !== orderId
                                );
                                return [...p];
                            });
                            {/* let p = pendingOrders.filter(pendingOrder =>
                                pendingOrder.orderId !== orderId
                            );
                            setPendingOrders([...p]);
                            return true; */}
                        },
                        orderIsExecuted(orderId, quantity) {
                            setPendingOrders(pendingOrders => {
                                let newPendingOrders = [];
                                for (let i = 0; i < pendingOrders.length; i++) {
                                    if (pendingOrders[i].orderId === orderId) {
                                        setExecutedOrders(executedOrders => {
                                            let e = executedOrders.concat({ ...pendingOrders[i], quantity });
                                            return [...e];
                                        })
                                        pendingOrders[i].quantity -= quantity;
                                        if (pendingOrders[i].quantity !== 0) {
                                            newPendingOrders.concat(pendingOrders[i]);
                                        }
                                    } else {
                                        newPendingOrders.concat(pendingOrders[i]);
                                    }
                                }
                                return [...newPendingOrders];
                            })
                            {/* let p = pendingOrders;
                            let e = executedOrders;
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
                            setPendingOrders([...newPendingOrders]); */}
                        },
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