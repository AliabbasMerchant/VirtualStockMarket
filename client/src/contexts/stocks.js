import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const StocksContext = React.createContext();

function StocksProvider(props) {
    let [stocks, setStocks] = useState(null);

    const initStocks = () => {
        if (stocks === null) {
            axios.post(`${constants.DOMAIN}/stocks`)
                .then(function (response) {
                    let s = response.data;
                    for (let i = 0; i < s.length; i++) {
                        s[i].prevRate = s[i].rate;
                    }
                    stocks = s;
                    setStocks([...s]);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return (
        <AuthContext.Consumer>
            {(authContext) =>
                authContext.userToken ?
                    <StocksContext.Provider value={{
                        stocks,
                        updateStockRate (id, newRate) {
                            stocks[id].prevRate = stocks[id].rate;
                            stocks[id].rate = newRate;
                            setStocks([...stocks.slice(0, id),stocks[id], ...stocks.slice(id+1)]);
                            return true;
                        }
                    }}>
                        {initStocks(authContext)}
                        {props.children}
                    </StocksContext.Provider>
                    :
                    <StocksContext.Provider value={{
                        stocks: null,
                        updateStockRate: (_id, _newRate) => {
                            return false;
                        }
                    }}>
                        {stocks = null}
                        {setStocks(null)}
                        {props.children}
                    </StocksContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { StocksProvider, StocksContext };