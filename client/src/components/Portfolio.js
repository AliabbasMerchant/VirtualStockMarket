import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import SellModal from './SellModal';
import FlashContainer from './FlashContainer';
import constants from '../constants';
import { deletePendingOrder } from '../reducers/orders';

function HoldingsTableHeader() {
    return <tr>
        <th>Scrip</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Current Rate</th>
        <th>Unrealised P/L</th>
        <th>Sell</th>
    </tr>
}
function HoldingsTableRow(props) {
    let holding = props.holding;
    let stock = props.stock;
    try {
        return <tr>
            <td>{stock.scrip}</td>
            <td>{Math.abs(holding.quantity)}</td>
            <td>{Number((holding.rate)).toFixed(2)}</td>
            <td>{Number((stock.rate)).toFixed(2)}</td>
            <td>{Number((stock.rate - holding.rate) * Math.abs(holding.quantity)).toFixed(2)}</td>
            <td><a className="btn waves-effect waves-light modal-trigger" href={"#sellModal" + holding.stockIndex}>SELL</a>
                <SellModal stock={stock} holding={holding} keepId={"sellModal" + holding.stockIndex} />
            </td>
        </tr>
    } catch (e) {
        return null;
    }
}
function ExecutedOrderTableHeader() {
    return <tr>
        <th>Scrip</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Status</th>
    </tr>
}
function ExecutedOrderTableRow(props) {
    let order = props.order;
    let stock = props.stock;
    try {
        return (
            <tr>
                <td>{stock.scrip}</td>
                <td>{Math.abs(order.quantity)}</td>
                <td>{Number((order.rate)).toFixed(2)}</td>
                {order.quantity > 0 ?
                    <td>Sold</td> :
                    <td>Bought</td>}
            </tr>
        )
    } catch (e) {
        return null;
    }
}
function PendingOrderTableHeader() {
    return <tr>
        <th>Scrip</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Status</th>
        <th>Cancel</th>
    </tr>
}
function PendingOrderTableRow(props) {
    let order = props.order;
    let stock = props.stock;
    let cancelOrderFunction = props.cancelOrderFunction;
    try {
        return (
            <tr>
                <td>{stock.scrip}</td>
                <td>{Math.abs(order.quantity)}</td>
                <td>{Number(order.rate).toFixed(2)}</td>
                {order.quantity > 0 ?
                    <td>To Sell</td> :
                    <td>To Buy</td>}
                <td><button className="btn waves-effect waves-light" onClick={() => cancelOrderFunction(order.orderId)}>CANCEL</button></td>
            </tr>
        )
    } catch (e) {
        return null;
    }
}

function getHoldings(executedOrders) {
    let holdings = {}; // stockIndex -> holding
    executedOrders.forEach(order => {
        try {
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
        } catch (e) {

        }
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

const Portfolio = ({ stocks, funds, executedOrders, pendingOrders, userToken, deletePendingOrder }) => {
    function cancelOrder(orderId) {
        axios.post(`${constants.DOMAIN}/cancelOrder`, {
            userToken,
            orderId
        })
            .then(function (response) {
                response = response.data;
                if (response.ok) {
                    window.M.toast({ html: "Pending Order Successfully Cancelled", classes: "toast-success" });
                    deletePendingOrder(orderId);
                } else {
                    window.M.toast({ html: response.message, classes: "toast-error" });
                }
            })
            .catch(console.log);
    }

    return (
        <div className="mx-auto p-3 center container">
            <div className="row">
                <div className="mx-auto col s12 md10 lg8">
                    <div>
                        <h3>Funds Remaining: Rs. <FlashContainer value={Number(funds).toFixed(2)} /></h3>
                        <hr />
                        <h4>Holdings</h4>
                        {getHoldings(executedOrders) ?
                            <table className="row">
                                <tbody>
                                    <HoldingsTableHeader />
                                    {getHoldings(executedOrders).map((holding, index) => {
                                        try {
                                            return <HoldingsTableRow key={index} stock={stocks[holding.stockIndex]} holding={holding} />
                                        } catch (e) {
                                            return null;
                                        }
                                    })}
                                </tbody>
                            </table> :
                            null}
                        <hr />
                        <h4>Pending Orders</h4>
                        {pendingOrders ?
                            <table className="row">
                                <tbody>
                                    <PendingOrderTableHeader />
                                    {pendingOrders.map((order, index) => {
                                        try {
                                            return <PendingOrderTableRow key={index} stock={stocks[order.stockIndex]} order={order} cancelOrderFunction={cancelOrder} />
                                        } catch (e) {
                                            return null;
                                        }
                                    })}
                                </tbody>
                            </table> :
                            null}
                        <hr />
                        <h4>Executed Orders</h4>
                        {executedOrders ?
                            <table className="row">
                                <tbody>
                                    <ExecutedOrderTableHeader />
                                    {executedOrders.map((order, index) => {
                                        try {
                                            return <ExecutedOrderTableRow key={index} stock={stocks[order.stockIndex]} order={order} />
                                        } catch (e) {
                                            return null;
                                        }
                                    })}
                                </tbody>
                            </table> :
                            null}
                    </div>
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = (state) => ({
    stocks: state.stocks,
    funds: state.funds,
    executedOrders: state.orders.executedOrders,
    pendingOrders: state.orders.pendingOrders,
    userToken: state.auth
});

const mapDispatchToProps = { deletePendingOrder };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Portfolio);
