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
                                axios.post(`${constants.DOMAIN}/stocks`)
                                    .then(function (response) {
                                        let s = response.data;
                                        for(let i=0;i<s.length;i++) {
                                            s[i].prevRate = s[i].rate;
                                        }
                                        setStocks(s);
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                            return stocks;
                        },
                        updateStockRate(id, newRate) {
                            stocks[id].prevRate = stocks[id].rate;
                            stocks[id].rate = newRate;
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
                        updateStockRate(id, newRate) {
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