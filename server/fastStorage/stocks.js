// TODO Redis

const stocks = require('../stocks');

stocksRates = [];

function initStockRates() {
    stocksRates = [];
    stocks.forEach((stock) => {
        stocksRates.push(stock.rate);
    });
}

function setStockRate(index, rate) {
    if (0 <= index <= stocksRates.length) {
        stocksRates[index] = rate;
    }
}

function getStockRate(index) {
    return (0 <= index <= stocksRates.length) ? stocksRates[index] : null;
}

function calcStocksRates() {
    // TODO
    initStockRates(); // Remove this
}

function getStocksRates() {
    return stocksRates;
}

module.exports = {
    initStockRates,
    setStockRate,
    getStockRate,
    getStocksRates,
    calcStocksRates
}
