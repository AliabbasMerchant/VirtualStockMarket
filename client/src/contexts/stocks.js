import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const StocksContext = React.createContext();

function StocksProvider(props) {
    const [stocks, setStocks] = useState(null);

    return (
        <AuthContext.Consumer>
            {(authContext) =>
                authContext.getUserToken() ?
                    <StocksContext.Provider value={{
                        getStocks() {
                            if (stocks == null) {
                                // axios call
                                // prevPrice
                                // setStocks
                            }
                            return stocks;
                        },
                        updateStockPrice(id, newPrice) {
                            stocks[id].prevPrice = stocks[id].price;
                            stocks[id].price = newPrice;
                            setStocks(stocks);
                            return true;
                        }
                    }}>
                        {props.children}
                    </StocksContext.Provider>
                    :
                    <StocksContext.Provider value={{
                        getStocks() {
                            return null;
                        },
                        updateStockPrice(id, newPrice) {
                            return false;
                        }
                    }}>
                        {setStocks(null)}
                        {props.children}
                    </StocksContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { StocksProvider, StocksContext };