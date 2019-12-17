import React from 'react';
import {
    Route,
    Switch,
    Redirect,
    useRouteMatch
} from "react-router-dom";
import Orders from '../Orders/Orders';
import Portfolio from '../Portfolio/Portfolio';
import Stock from '../Stock/Stock';

import './VSM.css';

function VSM() {
    let { path } = useRouteMatch();
    return (
        <div className="vsm-main">
            {/* TODO Make a component to maintain state */}
            <Switch>
                <Route exact path={path}>
                    <div>VSM</div>
                </Route>
                <Route path={`${path}/portfolio`}>
                    <Portfolio />
                </Route>
                <Route path={`${path}/orders`}>
                    <Orders />
                </Route>
                <Route path={`${path}/stock`}>
                    <Stock />
                </Route>
                <Route path="*">
                    <Redirect to={`${path}/`} />
                </Route>
            </Switch>
        </div>
    );
}

export default VSM;
