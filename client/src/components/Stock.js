import axios from 'axios';
import Chart from 'chart.js';
import {
    useLocation
} from "react-router-dom";
import React, { useEffect } from 'react';
import constants from '../constants';
import BuyModal from './BuyModal';
import { StocksContext } from '../contexts/stocks';
import { OrdersContext } from '../contexts/orders';

function Stock() {
    let stockIndex = Number((new URLSearchParams(useLocation().search)).get("stockIndex"));
    function timeToMins(time) {
        let secs = Math.round(time / 1000);
        let mins = Math.floor(secs / 60);
        secs = secs - mins * 60;
        return mins + 0.01*secs;
    }
    useEffect(() => {
        setTimeout(() => {
            axios.post(`${constants.DOMAIN}/getRateList/${stockIndex}`)
                .then(function (response) {
                    let ratesList = response.data;
                    for(let i=0;i<ratesList.length;i++) {
                        ratesList[i].time = Math.abs(ratesList[i].time)
                    }
                    ratesList.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    let rates = [];
                    let times = [];
                    for(let i=0;i<ratesList.length;i++) {
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
                .catch(function (error) {
                    console.log(error);
                });
        }, 1000);
    })

    function errorDiv() {
        return <div>No Such Stock</div>
    }

    function stockDataDiv(stock, stockIndex) {
        if (stock) {
            return (
                <OrdersContext.Consumer>
                    {(ordersContext) =>
                        <div className="mx-auto p-3 center container">
                            <div className="row">
                                <div className="mx-auto col s12 md10 lg8">
                                    <h1 className="my-2">{stock.name}</h1>
                                    <h3>{stock.scrip}</h3>
                                    <h4><span className="mr-3">Rs.{(stock.rate).toFixed(2)}</span>
                                        {stock.rate - stock.prevRate >= 0 ?
                                            <span className="ml-3 green-text">+{(stock.rate - stock.prevRate).toFixed(2)}</span>
                                            : <span className="ml-3 red-text">{(stock.rate - stock.prevRate).toFixed(2)}</span>}
                                    </h4>
                                    {/* <div className="m-3" style={{ backgroundColor: 'yellowgreen', height: '200px' }}>Chart</div> */}
                                    <canvas id="chart" width="360px" height="240px"></canvas>
                                    <a className="btn waves-effect waves-light modal-trigger" href="#buyModal">BUY</a>
                                    <BuyModal stock={stock} stockIndex={stockIndex} orderPlacedFunction={ordersContext.placeOrder} keepId="buyModal" />
                                </div>
                            </div>
                        </div>
                    }
                </OrdersContext.Consumer>
            )
        }
        return errorDiv();
    }
    return (
        <div>
            {stockIndex || stockIndex === 0
                ? <StocksContext.Consumer>
                    {(stocksContext) =>
                        stocksContext.stocks
                            ? stockDataDiv(stocksContext.stocks[stockIndex], stockIndex)
                            : errorDiv()
                    }
                </StocksContext.Consumer>
                : errorDiv()
            }
        </div>
    );
}

export default Stock;
