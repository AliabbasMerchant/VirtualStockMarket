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
    let stockId = (new URLSearchParams(useLocation().search)).get("stockId");
    return (
        <div>
            {stockId
                ? <StocksContext.Consumer>
                    {(stocksContext) =>
                        stocksContext.stocks
                            ? stockDataDiv(stocksContext.stocks[stockId])
                            : errorDiv()
                    }
                </StocksContext.Consumer>
                : errorDiv()
            }
        </div>
    );
}

export default Stock;
