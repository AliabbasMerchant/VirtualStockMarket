import {
    useLocation
} from "react-router-dom";
import React from 'react';

import { StocksContext } from '../contexts/stocks';

function errorDiv() {
    return <div>No such stock</div>
}

function stockDataDiv(stock) {
    if (stock) {
        // TODO
        return <div>{stock.name}</div>
    }
    return errorDiv()
}

function Stock() {
    let stockIndex = (new URLSearchParams(useLocation().search)).get("stockIndex");
    return (
        <div>
            {stockIndex
                ? <StocksContext.Consumer>
                    {(stocksContext) =>
                        stocksContext.stocks
                            ? stockDataDiv(stocksContext.stocks[stockIndex])
                            : errorDiv()
                    }
                </StocksContext.Consumer>
                : errorDiv()
            }
        </div>
    );
}

export default Stock;
