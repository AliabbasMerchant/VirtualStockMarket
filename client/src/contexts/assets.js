import axios from 'axios';
import React, { useState } from 'react';

import { AuthContext } from './auth';
import constants from '../constants';

const AssetsContext = React.createContext();

function AssetsProvider(props) {
    const [funds, setFunds] = useState(null);

    return (
        <AuthContext.Consumer>
            {(authContext) =>
                authContext.getUserToken() ?
                    <AssetsContext.Provider value={{
                        getFunds() {
                            if (funds === null) {
                                axios.post(`${constants.DOMAIN}/getFunds`, {
                                    userToken: authContext.getUserToken(),
                                })
                                    .then(function (response) {
                                        response = response.data;
                                        if (response.ok) {
                                            funds = response.funds;
                                            setFunds(funds);
                                        } else {
                                            console.log(response.message);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                            return funds;
                        },
                        changeFunds(newFunds) {
                            setFunds(newFunds);
                            return true;
                        }
                    }}>
                        {props.children}
                    </AssetsContext.Provider>
                    :
                    <AssetsContext.Provider value={{
                        getFunds() {
                            return null;
                        },
                        changeFunds(newFunds) {
                            return false;
                        }
                    }}>
                        {setFunds(null)}
                        {props.children}
                    </AssetsContext.Provider>
            }
        </AuthContext.Consumer>
    )
}

export { AssetsProvider, AssetsContext };