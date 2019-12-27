// TODO Redis

const stocksData = require('../stocks');

stocks = []; // index: {rate, quantity}

function initStocks() {
    stocks = [];
    stocksData.forEach((stock) => {
        stocks.push({ rate: stock.rate, quantity: stock.initialQuantity });
    });
}

function setStockQuantity(index, quantity) {
    if (0 <= index <= stocks.length) stocks[index].quantity = quantity;
}

function setStockRate(index, rate) {
    if (0 <= index <= stocks.length) stocks[index].rate = rate;
}

function getStockQuantity(index) {
    return (0 <= index <= stocks.length) ? stocks[index].quantity : null;
}

function getInitialStockQuantity(index) {
    return (0 <= index <= stocks.length) ? stocksData[index].initialQuantity : null;
}

function getStockRate(index) {
    return (0 <= index <= stocks.length) ? stocks[index].rate : null;
}

function calcStocksData() {
    // TODO
    initStocks(); // Remove this
}

function getStocks() {
    return stocks;
}

module.exports = {
    initStocks,
    setStockQuantity,
    getStockQuantity,
    getInitialStockQuantity,
    setStockRate,
    getStockRate,
    getStocks,
    // calcStocksData
}
