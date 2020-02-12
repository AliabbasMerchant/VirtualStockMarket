import Chart from 'chart.js';
import {
    useLocation
} from "react-router-dom";
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import BuyModal from './BuyModal';
import FlashContainer from './FlashContainer';

const Stock = ({ stocks }) => {
    let stockIndex = Number((new URLSearchParams(useLocation().search)).get("stockIndex"));
    useEffect(() => {
        setTimeout(() => {
            if (stocks[stockIndex]) {
                let ratesObject = stocks[stockIndex].ratesObject;
                // ratesObject = {0:910, [1000*30]: 920, [1000*60]:880, [1000*75]: 900, [1000*60*2]: 901.55, [1000*60*60]: 900, [1000*60*60*2+1000*60*3]: 910} // For Testing

                let sortedTimes = Object.keys(ratesObject).map(r => Number(r)).sort((a, b) => a - b);
                let times = [];
                let rates = [];
                let prevTime = null;
                for (let i = 0; i < sortedTimes.length; i++) {
                    let time = new Date(Math.round(sortedTimes[i] / 1000) * 1000);
                    time.setHours(time.getHours() + 18, time.getMinutes() + 30);
                    if (prevTime == null || time - prevTime !== 0) {
                        prevTime = time;
                        times.push(time);
                        rates.push(ratesObject[sortedTimes[i]]);
                    }
                }

                new Chart(document.getElementById('chart').getContext('2d'),
                    {
                        type: 'line',
                        data: {
                            labels: times,
                            datasets: [{
                                data: rates,
                                label: stocks[stockIndex].name,
                                borderColor: '#fe8b36',
                                backgroundColor: '#fe8b36',
                                fill: false,
                                lineTension: 0,
                            }]
                        },
                        options: {
                            animation: {
                                duration: 250
                            },
                            legend: {
                                display: false
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    type: 'time',
                                    distribution: 'linear',
                                    time: {
                                        tooltipFormat: 'HH:mm:ss',
                                        displayFormats: {
                                            second: 'HH:mm:ss',
                                            minute: 'HH:mm:ss',
                                            hour: 'HH:mm:ss',
                                            day: 'HH:mm:ss'
                                        },
                                        unit: 'minute'
                                    }
                                }],
                            }
                        }
                    });
            }
        }, 1000);
    });

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
                        <h4><span className="mr-3">Rs. <FlashContainer value={(stock.rate).toFixed(2)} /></span>
                            {stock.rate - stock.prevRate >= 0 ?
                                <span className="ml-3 green-text">
                                    <FlashContainer value={`+${(stock.rate - stock.prevRate).toFixed(2)}`} />
                                </span>
                                : <span className="ml-3 red-text">
                                    <FlashContainer value={(stock.rate - stock.prevRate).toFixed(2)} />
                                </span>}
                        </h4>
                    </div>
                    <div className="chart-container">
                        <canvas className="my-3" id="chart" style={{ width: '180px', height: '90px' }}></canvas>
                    </div>
                    <div>
                        <a className="btn waves-effect waves-light modal-trigger" href="#buyModal">BUY</a>
                        <BuyModal stock={stock} stockIndex={stockIndex} keepId="buyModal" />
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

const mapDispatchToProps = null;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Stock);
