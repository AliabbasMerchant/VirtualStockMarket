import Cookies from 'js-cookie';
import axios from 'axios';
import React from 'react';
import SellModal from './SellModal';
import constants from '../constants';
import { StocksContext } from '../contexts/stocks';
import { OrdersContext } from '../contexts/orders';
import { AssetsContext } from '../contexts/assets';

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
        <td>{holding.rate}</td>
        <td>{stock.rate}</td>
        <td>{(stock.rate - holding.rate) * Math.abs(holding.quantity)}</td>
        <td><a className="btn waves-effect waves-light modal-trigger" href={"#sellModal"+holding.stockIndex}>SELL</a>
            <SellModal stock={stock} holding={holding} sellOrderPlacedFunction={sellOrderPlacedFunction} keepId={"sellModal"+holding.stockIndex}/>
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
            <td>{order.rate}</td>
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
            <td>{order.rate}</td>
            {order.quantity > 0 ?
                <td>To Sell</td> :
                <td>To Buy</td>}
            <td><button className="btn waves-effect waves-light" onClick={() => cancelOrder(order.orderId, order.stockIndex, deletePendingOrderFunction)}>CANCEL</button></td>
        </tr>
    )
}

function Portfolio() {
    return (
        <div className="mx-auto p-3 center container">
            <div className="row">
                <div className="mx-auto col s12 md10 lg8">
                    <StocksContext.Consumer>
                        {(stocksContext) =>
                            <OrdersContext.Consumer>
                                {(ordersContext) =>
                                    <AssetsContext.Consumer>
                                        {(assetsContext) =>
                                            <div>
                                                <h3>Funds Remaining: Rs.{assetsContext.funds}</h3>
                                                <hr />
                                                <h4>Holdings</h4>
                                                {ordersContext.getHoldings() ?
                                                    <table className="row">
                                                        <tbody>
                                                            <HoldingsTableHeader />
                                                            {ordersContext.getHoldings().map((holding, index) => {
                                                                return <HoldingsTableRow key={index} stock={stocksContext.stocks[holding.stockIndex]} holding={holding} sellOrderPlacedFunction={ordersContext.placeOrder} />
                                                            })}
                                                        </tbody>
                                                    </table> :
                                                    null}
                                                <hr />
                                                <h4>Pending Orders</h4>
                                                {ordersContext.pendingOrders ?
                                                    <table className="row">
                                                        <tbody>
                                                            <PendingOrderTableHeader />
                                                            {ordersContext.pendingOrders.map((order, index) => {
                                                                return <PendingOrderTableRow key={index} stock={stocksContext.stocks[order.stockIndex]} order={order} deletePendingOrderFunction={ordersContext.deletePendingOrder} />
                                                            })}
                                                        </tbody>
                                                    </table> :
                                                    null}
                                                <hr />
                                                <h4>Executed Orders</h4>
                                                {ordersContext.executedOrders ?
                                                    <table className="row">
                                                        <tbody>
                                                            <ExecutedOrderTableHeader />
                                                            {ordersContext.executedOrders.map((order, index) => {
                                                                return <ExecutedOrderTableRow key={index} stock={stocksContext.stocks[order.stockIndex]} order={order} />
                                                            })}
                                                        </tbody>
                                                    </table> :
                                                    null}
                                            </div>
                                        }
                                    </AssetsContext.Consumer>
                                }
                            </OrdersContext.Consumer>
                        }
                    </StocksContext.Consumer>
                </div>
            </div>
        </div>
    );
}

export default Portfolio;
