const globals = require('./globals');
const stocksData = require('../stocks');

const STOCKS_KEY = 'vsm_stocks';

let instance;

function initStocks(redis_client) {
    instance = redis_client;
    instance.del(STOCKS_KEY, '.')
        .then()
        .catch(e => console.log(e))
        .finally(() => {
            instance.set(STOCKS_KEY, '.', {})
                .then()
                .catch(e => console.log(e))
                .finally(() => {
                    stocksData.forEach((stock, stockIndex) => {
                        let newStock = { rate: stock.rate, quantity: stock.initialQuantity };
                        newStock.rateList = [];
                        globals.getInitialTime()
                            .then(time => {
                                newStock.rateList.push({ rate: stock.rate, timestamp: time });
                            })
                            .catch(err => {
                                console.log(err);
                                newStock.rateList.push({ rate: stock.rate, timestamp: Date.now() });
                            })
                            .finally(() => {
                                instance.set(STOCKS_KEY, stockIndex, newStock)
                                    .then()
                                    .catch(e => console.log(e));
                            });
                    });
                });
        });
}

function getStockQuantity(stockIndex) {
    return new Promise((resolve, reject) => {
        instance.get(STOCKS_KEY, stockIndex)
            .then(res => {
                if (!res.quantity) {
                    reject("No such stock");
                } else {
                    resolve(res.quantity);
                }
            }).catch((err) => {
                reject(err);
            })
    });
}

async function setStockQuantity(stockIndex, quantity) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        await instance.del(STOCKS_KEY, stockIndex);
        res.quantity = quantity;
        await instance.set(STOCKS_KEY, res);
    } catch (error) {
        console.log(error);
    }
}

function getStockRate(stockIndex) {
    return new Promise((resolve, reject) => {
        instance.get(STOCKS_KEY, stockIndex)
            .then(res => {
                if (!res.rate) {
                    reject("No such stock");
                } else {
                    resolve(res.rate);
                }
            }).catch(err => {
                reject(err);
            });
    });
}

async function setStockRate(stockIndex, rate) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        await instance.del(STOCKS_KEY, stockIndex);
        res.rate = rate;
        res.rateList.push({ rate, timestamp: Date.now() });
        await instance.set(STOCKS_KEY, res);
    } catch (error) {
        console.log(error);
    }
}


function getStockRateList(stockIndex) {
    return new Promise((resolve, reject) => {
        instance.get(STOCKS_KEY, stockIndex)
            .then(res => {
                if (!res.rateList) {
                    reject("No such stock");
                } else {
                    resolve(res.rateList);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getStocks() {
    return instance.get(STOCKS_KEY, '.');
}

module.exports = {
    setStockQuantity,
    getStockQuantity,
    setStockRate,
    getStockRate,
    getStocks,
    getStockRateList,
    initStocks
}
