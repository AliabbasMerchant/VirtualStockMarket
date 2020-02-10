const globals = require('./globals');
const stocksData = require('../stocks');

const STOCKS_KEY = 'vsm_stocks';

instance = null;

function initStocks(redis_client) {
    instance = redis_client;
}

async function initialize() {
    try {
        await instance.del(STOCKS_KEY, '.');
    } catch (err) {
        // ignore
    }
    try {
        await instance.set(STOCKS_KEY, '.', {});
        for (const stockIndex in stocksData) {
            const stock = stocksData[stockIndex];
            let newStock = { rate: stock.rate, quantity: stock.initialQuantity, rateList: [] };
            let time = Date.now();
            try {
                time = await globals.getInitialTime();
            } catch (err) {
                console.log(err);
            }
            newStock.rateList.push({ rate: stock.rate, timestamp: time });
            instance.set(STOCKS_KEY, stockIndex, newStock)
                .then()
                .catch(console.log);
        }
    } catch (err) {
        console.log(err)
    }
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

async function deductStockQuantity(stockIndex, quantity) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        await instance.del(STOCKS_KEY, stockIndex);
        res.quantity -= quantity;
        await instance.set(STOCKS_KEY, stockIndex, res);
    } catch (error) {
        console.log(error);
    }
}

async function setStockQuantity(stockIndex, quantity) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        await instance.del(STOCKS_KEY, stockIndex);
        res.quantity = quantity;
        await instance.set(STOCKS_KEY, stockIndex, res);
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
    return new Promise((resolve, reject) => {
        instance.get(STOCKS_KEY, '.')
            .then(stocks => {
                let res = new Array(Object.keys(stocks).length);
                Object.keys(stocks).forEach(stockIndex => {
                    let stock = stocks[stockIndex];
                    stock.stockIndex = stockIndex;
                    res[stockIndex] = stock;
                });
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getStocksRaw() {
    return instance.get(STOCKS_KEY, ".");
}

module.exports = {
    setStockQuantity,
    deductStockQuantity,
    getStockQuantity,
    setStockRate,
    getStockRate,
    getStocks,
    getStockRateList,
    getStocksRaw,
    initStocks,
    initialize
}
