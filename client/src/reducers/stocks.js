import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const StocksContext = React.createContext();

function StocksProvider(props) {
    let [stocks, setStocks] = useState([]);
    let [got, setGot] = useState(false);

    const initStocks = () => {
        if (!got) { // Okay. No prob
            setGot(true);
            axios.post(`${constants.DOMAIN}/getStocks`)
                .then(function (response) {
                    let s = response.data;
                    console.log("getStocks", s);
                    for (let i = 0; i < s.length; i++) {
                        s[i].prevRate = s[i].rate;
                    }
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
                        updateStockRate: (id, newRate) => { // TODO BREAKS!
                            setStocks(stocks => {
                                console.log(stocks, stocks[id]);
                                stocks[id].prevRate = stocks[id].rate;
                                stocks[id].rate = newRate;
                                return [...stocks.slice(0, id), stocks[id], ...stocks.slice(id + 1)];
                            });
                        }
                    }}>
                        {initStocks(authContext)}
                        {props.children}
                    </StocksContext.Provider>
                    :
                    <StocksContext.Provider value={{
                        stocks: [],
                        updateStockRate: (_id, _newRate) => {  }
                    }}>
                        {/* {setGot(true)} */}
                        {props.children}
                    </StocksContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { StocksProvider, StocksContext };