import {
    useLocation
} from "react-router-dom";
import React from 'react';

import BuyModal from './BuyModal';
import { StocksContext } from '../contexts/stocks';
import { OrdersContext } from '../contexts/orders';

function Stock() {
    let stockIndex = Number((new URLSearchParams(useLocation().search)).get("stockIndex"));

    function errorDiv() {
        return <div>No Such Stock</div>
    }

    function stockDataDiv(stock, stockIndex) {
        if (stock) {
            return (
                <OrdersContext.Consumer>
                    {(ordersContext) =>
                        <div className="mx-auto p-3 center container">
                            <div className="row">
                                <div className="mx-auto col s12 md10 lg8">
                                    <h1 className="my-2">{stock.name}</h1>
                                    <h3>{stock.scrip}</h3>
                                    <h4><span className="mr-3">Rs.{stock.rate}</span>
                                        {stock.rate - stock.prevRate >= 0 ?
                                            <span className="ml-3 green-text">+{stock.rate - stock.prevRate}</span>
                                            : <span className="ml-3 red-text">{stock.rate - stock.prevRate}</span>}
                                    </h4>
                                    {/* <div className="m-3" style={{ backgroundColor: 'yellowgreen', height: '200px' }}>Chart</div> */}
                                    <a className="btn waves-effect waves-light modal-trigger" href="#buyModal">BUY</a>
                                    <BuyModal stock={stock} stockIndex={stockIndex} orderPlacedFunction={ordersContext.placeOrder} keepId="buyModal" />
                                </div>
                            </div>
                        </div>
                    }
                </OrdersContext.Consumer>
            )
        }
        return errorDiv();
    }
    return (
        <div>
            {stockIndex || stockIndex === 0
                ? <StocksContext.Consumer>
                    {(stocksContext) =>
                        stocksContext.stocks
                            ? stockDataDiv(stocksContext.stocks[stockIndex], stockIndex)
                            : errorDiv()
                    }
                </StocksContext.Consumer>
                : errorDiv()
            }
        </div>
    );
}

export default Stock;
