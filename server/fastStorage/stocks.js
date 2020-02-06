const Rejson = require('iorejson');

const globals = require('./globals');

const STOCKS_KEY = 'vsm_stocks';

const instance = new Rejson();
instance.connect();

client.on('connect', function () {
    console.log('Stocks: Redis client connected');
});
client.on('error', function (err) {
    console.log('Stocks: Redis Error ' + err);
});

const stocksData = require('../stocks');

async function initStocks() {
    try {
        await instance.del(STOCKS_KEY, '.');
        await instance.set(STOCKS_KEY, '.', {});
        stocksData.forEach((stock, stockIndex) => {
            let newStock = { rate: stock.rate, quantity: stock.initialQuantity };
            newStock.rateList = [];
            newStock.rateList.push({ rate: stock.rate, timestamp: await globals.getInitialTime() });
            await instance.set(STOCKS_KEY, stockIndex, newStock);
        });
    } catch (err) {
        console.log(err);
    }
}

async function getStockQuantity(stockIndex) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        if (!res.quantity) return 0;
        return res.quantity;
    } catch (err) {
        console.log(err);
        return 0;
    }
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

async function getStockRate(stockIndex) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        if (!res.rate) return 0;
        return res.rate;
    } catch (err) {
        console.log(err);
        return 0;
    }
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


async function getStockRateList(stockIndex) {
    try {
        let res = await instance.get(STOCKS_KEY, stockIndex);
        if (!res.rateList) return [];
        return res.rateList;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getStocks() {
    try {
        let res = await instance.get(STOCKS_KEY, '.');
        return res;
    } catch (err) {
        console.log(err);
        return {};
    }
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
