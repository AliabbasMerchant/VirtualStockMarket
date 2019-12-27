import React from 'react';

import { StocksContext } from '../contexts/stocks';
import { OrdersContext } from '../contexts/orders';
import { AssetsContext } from '../contexts/assets';

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
    return <tr>
        <td>{stock.scrip}</td>
        <td>{Math.abs(holding.quantity)}</td>
        <td>{holding.rate}</td>
        <td>{stock.rate}</td>
        <td>{(stock.rate - holding.rate) * Math.abs(holding.quantity)}</td>
        <td>TODO</td>
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
    return (
        <tr>
            <td>{stock.scrip}</td>
            <td>{Math.abs(order.quantity)}</td>
            <td>{order.rate}</td>
            {order.quantity > 0 ?
                <td>To Sell</td> :
                <td>To Buy</td>}
            <td>TODO</td>
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
                                                                return <HoldingsTableRow key={index} stock={stocksContext.stocks[holding.stockIndex]} holding={holding} />
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
                                                            {ordersContext.pendingOrders.map((order) => {
                                                                return <PendingOrderTableRow key={order.orderId} stock={stocksContext.stocks[order.stockIndex]} order={order} />
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
                                                            {ordersContext.executedOrders.map((order) => {
                                                                return <ExecutedOrderTableRow key={order.orderId} stock={stocksContext.stocks[order.stockIndex]} order={order} />
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
