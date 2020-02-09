import axios from 'axios';
import Chart from 'chart.js';
import {
    useLocation
} from "react-router-dom";
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import constants from '../constants';
import BuyModal from './BuyModal';
import { placeOrder } from '../reducers/orders';

const Stock = ({ stocks, placeOrder }) => {
    let stockIndex = Number((new URLSearchParams(useLocation().search)).get("stockIndex"));
    function timeToMins(time) {
        let secs = Math.round(time / 1000);
        let mins = Math.floor(secs / 60);
        secs = secs - mins * 60;
        return mins + 0.01 * secs;
    }
    /*
    useEffect(() => { // TODO Change
        setTimeout(() => {
            axios.post(`${constants.DOMAIN}/getRateList/${stockIndex}`, { userToken })
                .then(function (response) {
                    let ratesList = response.data;
                    for (let i = 0; i < ratesList.length; i++) {
                        ratesList[i].time = Math.abs(ratesList[i].time)
                    }
                    ratesList.sort(function (a, b) {
                        return a.time - b.time;
                    });
                    let rates = [];
                    let times = [];
                    for (let i = 0; i < ratesList.length; i++) {
                        let rateItem = ratesList[i];
                        rates.push(rateItem.rate);
                        times.push(timeToMins(rateItem.time));
                    }
                    var ctx = document.getElementById('chart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: times,
                            datasets: [{
                                data: rates,
                                label: "Stock",
                                borderColor: "#3e95cd",
                                fill: false
                            }]
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'Price Chart'
                            }
                        }
                    });
                })
                .catch(console.log);
        }, 1000);
    });
    */

    function errorDiv() {
        return <div>No Such Stock</div>
    }

    function stockDataDiv(stock, stockIndex) {
        if (stock) {
            return <div className="mx-auto p-3 center container">
                <div className="row">
                    <div className="mx-auto col s12 md10 lg8">
                        <h1 className="my-2">{stock.name}</h1>
                        <h3>{stock.scrip}</h3>
                        <h4><span className="mr-3">Rs.{(stock.rate).toFixed(2)}</span>
                            {stock.rate - stock.prevRate >= 0 ? // TODO Change
                                <span className="ml-3 green-text">+{(stock.rate - stock.prevRate).toFixed(2)}</span>
                                : <span className="ml-3 red-text">{(stock.rate - stock.prevRate).toFixed(2)}</span>}
                        </h4>
                        {/* <canvas id="chart" width="360px" height="240px"></canvas> */}
                        <a className="btn waves-effect waves-light modal-trigger" href="#buyModal">BUY</a>
                        <BuyModal stock={stock} stockIndex={stockIndex} orderPlacedFunction={placeOrder} keepId="buyModal" />
                    </div>
                </div>
            </div>
        }
        return errorDiv();
    }
    return (
        <div>
            {stockIndex || stockIndex === 0
                ? stockDataDiv(stocks[stockIndex], stockIndex)
                : errorDiv()
            }
        </div>
    );
}

const mapStateToProps = (state) => ({
    stocks: state.stocks
});

const mapDispatchToProps = { placeOrder };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Stock);
