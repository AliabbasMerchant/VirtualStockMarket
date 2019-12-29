// TODO Redis
const constants = require('../constants');
const stocksData = require('../stocks');

const mongoose = require('mongoose');
const stocksModel = mongoose.model('vsm_stocks', mongoose.Schema({
    stockIndex: { type: Number, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    rateList: [{
        rate: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    }]
}));

function initStocks() {
    stocksModel.deleteMany({}, (err) => console.log(err));
    stocksData.forEach((stock, stockIndex) => {
        const newStockModel = new stocksModel({ stockIndex, rate: stock.rate, quantity: stock.initialQuantity });
        newStockModel.rateList.push({ rate: stock.rate, timestamp: constants.initialTime });
        newStockModel.save()
            .then(_stock => { })
            .catch(err => {
                console.log(err);
            });
    });
}

function setStockQuantity(stockIndex, quantity) {
    stocksModel.findOne({ stockIndex }, (err, stock) => {
        if (err) {
            console.log(err);
        } else {
            stock.quantity = quantity;
            stock.save()
                .then(_stock => { })
                .catch(err => {
                    console.log(err);
                });
        }
    });
}

function setStockRate(stockIndex, rate) {
    stocksModel.findOne({ stockIndex }, (err, stock) => {
        if (err) {
            console.log(err);
        } else {
            stock.rate = rate;
            stock.rateList.push({ rate, timestamp: Date.now() })
            stock.save()
                .then(_stock => { })
                .catch(err => {
                    console.log(err);
                });
        }
    });
}

async function getStockQuantity(stockIndex) {
    try {
        let result = await stocksModel.findOne({ stockIndex });
        if (!result) return null;
        return result.quantity;
    } catch (err) {
        console.log(err);
        return null;
    }
}

function getInitialStockQuantity(stockIndex) {
    return (0 <= stockIndex <= stocksData.length) ? stocksData[stockIndex].initialQuantity : null;
}

async function getStockRate(stockIndex) {
    try {
        let result = await stocksModel.findOne({ stockIndex });
        if (!result) return null;
        return result.rate;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getStockRateList(stockIndex) {
    try {
        let result = await stocksModel.findOne({ stockIndex } );
        if (!result) return null;
        return result.rateList;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getStocks() {
    try {
        return await stocksModel.find({});
    } catch (err) {
        console.log(err);
        return [];
    }
}

module.exports = {
    setStockQuantity,
    getStockQuantity,
    getInitialStockQuantity,
    setStockRate,
    getStockRate,
    getStocks,
    getStockRateList,
    initStocks
}
