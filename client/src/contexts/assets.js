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
                                // axios call
                                // setFunds
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