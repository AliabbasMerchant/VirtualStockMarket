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
            console.log(stock)
            let newStock = { rate: stock.rate, quantity: stock.initialQuantity, ratesObject: { [Date.now()]: stock.rate } };
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
                if (res && res.quantity) {
                    resolve(res.quantity);
                } else {
                    reject("No such stock");
                }
            }).catch((err) => {
                reject(err);
            })
    });
}

async function deductStockQuantity(stockIndex, quantity) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        if (res) {
            await instance.del(STOCKS_KEY, stockIndex);
            res.quantity -= quantity;
            await instance.set(STOCKS_KEY, stockIndex, res);
        }
    } catch (error) {
        console.log('deductStockQuantity', error);
    }
}

async function setStockQuantity(stockIndex, quantity) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        if (res) {
            await instance.del(STOCKS_KEY, stockIndex);
            res.quantity = quantity;
            await instance.set(STOCKS_KEY, stockIndex, res);
        }
    } catch (error) {
        console.log('setStockQuantity', error);
    }
}

function getStockRate(stockIndex) {
    return new Promise((resolve, reject) => {
        instance.get(STOCKS_KEY, stockIndex)
            .then(res => {
                if (res && res.rate) {
                    resolve(res.rate);
                } else {
                    reject("No such stock");
                }
            }).catch(err => {
                reject(err);
            });
    });
}

async function setStockRate(stockIndex, rate) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        if (res) {
            await instance.del(STOCKS_KEY, stockIndex);
            res.rate = rate;
            res.ratesObject[[Date.now()]] = rate;
            await instance.set(STOCKS_KEY, stockIndex, res);
        }
    } catch (error) {
        console.log('setStockRate', error);
    }
}

function getStocks() {
    return new Promise((resolve, reject) => {
        instance.get(STOCKS_KEY, '.')
            .then(stocks => {
                if (stocks) {
                    let res = new Array(Object.keys(stocks).length);
                    Object.keys(stocks).forEach(stockIndex => {
                        let stock = stocks[stockIndex];
                        stock.stockIndex = stockIndex;
                        res[stockIndex] = stock;
                    });
                    resolve(res);
                } else resolve([]);
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
    setStockQuantity, // lock
    deductStockQuantity, // lock
    getStockQuantity, // lock
    setStockRate, // lock
    getStockRate, // lock
    getStocks, // lock
    getStocksRaw,
    initStocks,
    initialize // lock
}
