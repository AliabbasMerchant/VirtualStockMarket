import React from 'react';
import {
    useHistory,
} from "react-router-dom";

import { StocksContext } from '../contexts/stocks';

import StocksListElement from './StocksListElement';

function VSM() {
    let history = useHistory();
    return (
        <div>
            <StocksContext.Consumer>
                {(stocksContext) =>
                    stocksContext.getStocks() ?
                        <div className="my-3 mx-auto p-3 center container">
                            <div className="row">
                                <div className="mx-auto col s12 md10 lg8">
                                    {stocksContext.getStocks().map((stock, stockIndex) =>
                                        <StocksListElement key={stockIndex} data={stock} />
                                    )}
                                </div>
                            </div>
                        </div>
                        :
                        history.replace("/login")
                }
            </StocksContext.Consumer>
        </div>
    );
}

export default VSM;
