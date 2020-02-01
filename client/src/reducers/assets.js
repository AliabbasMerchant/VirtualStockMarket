import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const AssetsContext = React.createContext();

function AssetsProvider(props) {
    let [funds, setFunds] = useState(0);
    let [got, setGot] = useState(false);

    function initFunds(authContext) {
        if (!got) {
            setGot(true);
            axios.post(`${constants.DOMAIN}/getFunds`, {
                userToken: authContext.userToken,
            })
                .then(function (response) {
                    response = response.data;
                    console.log("getFunds", response);
                    if (response.ok) {
                        setFunds(Number(response.funds));
                    } else {
                        console.log("getFunds Error", response.message);
                    }
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
                    <AssetsContext.Provider value={{
                        funds,
                        fundsChange: (additional) => {
                            setFunds(f => f + additional);
                        },
                    }}>
                        {initFunds(authContext)}
                        {props.children}
                    </AssetsContext.Provider>
                    :
                    <AssetsContext.Provider value={{
                        funds: null,
                        fundsChange: (_) => { },
                    }}>
                        {props.children}
                    </AssetsContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { AssetsProvider, AssetsContext };