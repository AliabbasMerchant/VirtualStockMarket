import Cookies from 'js-cookie';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import SellModal from './SellModal';
import constants from '../constants';
import { placeOrder, deletePendingOrder } from '../reducers/orders';

// TODO Verify

function cancelOrder(orderId, stockIndex, deletePendingOrderFunction) {
    axios.post(`${constants.DOMAIN}/cancelOrder`, {
        userToken: Cookies.get(constants.tokenCookieName),
        orderId,
        stockIndex
    })
        .then(function (response) {
            response = response.data;
            if (response.ok) {
                window.M.toast({ html: "Pending Order Successfully Cancelled", classes: "toast-success" });
                deletePendingOrderFunction(orderId);
            } else {
                window.M.toast({ html: response.message, classes: "toast-error" });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

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
    let sellOrderPlacedFunction = props.sellOrderPlacedFunction;
    return <tr>
        <td>{stock.scrip}</td>
        <td>{Math.abs(holding.quantity)}</td>
        <td>{Number((holding.rate)).toFixed(2)}</td>
        <td>{Number((stock.rate)).toFixed(2)}</td>
        <td>{Number((stock.rate - holding.rate) * Math.abs(holding.quantity)).toFixed(2)}</td>
        <td><a className="btn waves-effect waves-light modal-trigger" href={"#sellModal" + holding.stockIndex}>SELL</a>
            <SellModal stock={stock} holding={holding} sellOrderPlacedFunction={sellOrderPlacedFunction} keepId={"sellModal" + holding.stockIndex} />
        </td>
    </tr>
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
    let deletePendingOrderFunction = props.deletePendingOrderFunction;
    return (
        <tr>
            <td>{stock.scrip}</td>
            <td>{Math.abs(order.quantity)}</td>
            <td>{Number((order.rate)).toFixed(2)}</td>
            {order.quantity > 0 ?
                <td>To Sell</td> :
                <td>To Buy</td>}
            <td><button className="btn waves-effect waves-light" onClick={() => cancelOrder(order.orderId, order.stockIndex, deletePendingOrderFunction)}>CANCEL</button></td>
        </tr>
    )
}

function getHoldings(executedOrders) {
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

const Portfolio = ({ stocks, funds, executedOrders, pendingOrders }) => {
    return (
        <div className="mx-auto p-3 center container">
            <div className="row">
                <div className="mx-auto col s12 md10 lg8">
                    <div>
                        <h3>Funds Remaining: Rs.{funds}</h3>
                        <hr />
                        <h4>Holdings</h4>
                        {getHoldings(executedOrders) ?
                            <table className="row">
                                <tbody>
                                    <HoldingsTableHeader />
                                    {getHoldings(executedOrders).map((holding, index) => {
                                        return <HoldingsTableRow key={index} stock={stocks[holding.stockIndex]} holding={holding} sellOrderPlacedFunction={placeOrder} />
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
                                        return <PendingOrderTableRow key={index} stock={stocks[order.stockIndex]} order={order} deletePendingOrderFunction={deletePendingOrder} />
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
                                        return <ExecutedOrderTableRow key={index} stock={stocks[order.stockIndex]} order={order} />
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
    pendingOrders: state.orders.pendingOrders
});

const mapDispatchToProps = {
    placeOrder,
    deletePendingOrder
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Portfolio);
