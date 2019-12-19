import React from 'react';

import { StocksContext } from '../contexts/stocks';

import StocksListElement from './StocksListElement';

function VSM() {
    return (
        <StocksContext.Consumer>
            {(stocksContext) =>
                stocksContext.getStocks() &&
                <div className="mx-0 center container" style={{ width: '100%', maxWidth: '100%' }}>
                    <table className="row">
                        <tbody>
                        {stocksContext.getStocks().map((stock, stockIndex) =>
                            <StocksListElement key={stockIndex} data={stock} id={stockIndex} />
                        )}
                        </tbody>
                    </table>
                </div>
            }
        </StocksContext.Consumer>
    );
}

export default VSM;
