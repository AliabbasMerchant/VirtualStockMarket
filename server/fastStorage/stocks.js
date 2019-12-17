// TODO Redis

const stocks = require('../stocks');

stocksPrices = [];

function initStockPrices() {
    stocksPrices = [];
    stocks.forEach((stock) => {
        stocksPrices.push(stock.price);
    });
}

function setStockPrice(index, price) {
    if (0 <= index <= stocksPrices.length) {
        stocksPrices[index] = price;
    }
}

function getStockPrice(index) {
    return (0 <= index <= stocksPrices.length) ? stocksPrices[index] : null;
}

function calcStocksPrices() {
    // TODO?
    initStockPrices(); // Remove this
}

function getStocksPrices() {
    return stocksPrices;
}

module.exports = {
    initStockPrices,
    setStockPrice,
    getStockPrice,
    getStocksPrices,
    calcStocksPrices
}
