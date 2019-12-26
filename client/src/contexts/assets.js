import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const AssetsContext = React.createContext();

function AssetsProvider(props) {
    const [funds, setFunds] = useState(null);

    function initFunds(authContext) {
        if (funds === null) {
            axios.post(`${constants.DOMAIN}/getFunds`, {
                userToken: authContext.userToken,
            })
                .then(function (response) {
                    response = response.data;
                    if (response.ok) {
                        setFunds(funds);
                    } else {
                        console.log(response.message);
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
                        changeFunds(newFunds) {
                            setFunds(newFunds);
                            return true;
                        }
                    }}>
                        {initFunds(authContext)}
                        {props.children}
                    </AssetsContext.Provider>
                    :
                    <AssetsContext.Provider value={{
                        funds: null,
                        changeFunds() {},
                    }}>
                        {setFunds(null)}
                        {props.children}
                    </AssetsContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { AssetsProvider, AssetsContext };