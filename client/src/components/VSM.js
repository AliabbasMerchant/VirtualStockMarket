import React from 'react';

import { StocksContext } from '../contexts/stocks';

import StocksListElement from './StocksListElement';

function VSM() {
    return (
        <StocksContext.Consumer>
            {(stocksContext) =>
                stocksContext.stocks ?
                    <div className="mx-0 center container" style={{ width: '100%', maxWidth: '100%' }}>
                        <table className="row">
                            <tbody>
                                {stocksContext.stocks.map((stock, stockIndex) => {
                                    console.log("render", stock);
                                    return <StocksListElement key={stockIndex} data={stock} id={stockIndex} />
                                })}
                            </tbody>
                        </table>
                    </div> :
                    <div className="center container">No stocks</div>
            }
        </StocksContext.Consumer>
    );
}

export default VSM;
