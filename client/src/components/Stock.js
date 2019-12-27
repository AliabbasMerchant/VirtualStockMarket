import {
    useLocation
} from "react-router-dom";
import React from 'react';

import BuyModal from './BuyModal';
import { StocksContext } from '../contexts/stocks';

function Stock() {
    let stockIndex = (new URLSearchParams(useLocation().search)).get("stockIndex");

    function errorDiv() {
        return <div>No such stock</div>
    }

    function stockDataDiv(stock, stockIndex) {
        if (stock) {
            return (
                <div className="mx-0 center container" style={{ width: '100%', maxWidth: '100%' }}>
                    <h1 className="my-2">{stock.name}</h1>
                    <h3>{stock.scrip}</h3>
                    <h4><span className="mr-3">Rs.{stock.rate}</span>
                        {stock.rate - stock.prevRate >= 0 ?
                            <span className="ml-3 green-text">+{stock.rate - stock.prevRate}</span>
                            : <span className="ml-3 red-text">{stock.rate - stock.prevRate}</span>}
                    </h4>
                    <div className="m-3" style={{ backgroundColor: 'yellowgreen', height: '200px' }}>Chart</div>
                    <a className="btn waves-effect waves-light modal-trigger" href="#buyModal">BUY</a>

                    <BuyModal stock={stock} stockIndex={stockIndex} />
                </div>
            )
        }
        return errorDiv();
    }
    return (
        <div>
            {stockIndex
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
