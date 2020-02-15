const express = require("express");

const router = express.Router();

const globalStorage = require('./fastStorage/globals');
const stocksStorage = require('./fastStorage/stocks');
const ordersStorage = require('./fastStorage/orders');
const socketsStorage = require('./fastStorage/sockets');
const exchangesStorage = require('./fastStorage/exchanges');
const userModel = require('./models/users');
const auth = require('./auth');
const stocks = require('./stocks');

function checkIfDeveloper(req, res, next) {
    const { userToken } = req.body;
    auth.verifyToken(userToken, (err, decoded) => {
        if (err) {
            console.log(err);
            res.json({
                ok: false,
                message: "Only Developers can access this",
            });
        } else {
            if (decoded.content = "I AM THE DEVELOPER") {
                next();
            } else {
                res.json({
                    ok: false,
                    message: "Only Developers can access this",
                });
            }
        }
    });
}

router.post('/init', checkIfDeveloper, async (req, res) => {
    // clear all storage
    // init memory
    // set initial time
    // set buyingPeriod to true
    // set playing to true
    const { unsafe } = req.body;
    if (!unsafe) {
        userModel.find({})
            .then(users => {
                users.forEach(user => {
                    user.executedOrders = [];
                    user.funds = Number(process.env.INITIAL_FUNDS);
                    user.save();
                });
            })
            .catch(console.log);
    } else {
        userModel.deleteMany({}).then().catch(console.log);
    }
    await globalStorage.initialize();
    await globalStorage.setInitialTime(Date.now());
    await globalStorage.setBuyingPeriod(true);
    await globalStorage.setPlayingStatus(true);
    await ordersStorage.initialize();
    await socketsStorage.initialize();
    await stocksStorage.initialize();
    await exchangesStorage.initialize();
    return res.send('OK');
});

router.post('/initMemory', checkIfDeveloper, async (req, res) => { // very risky
    const {initialTime, buyingPeriod, playingStatus, } = req.body
    if (!initialTime || !buyingPeriod || !playingStatus) {
        res.json({
            ok: false,
            message: "Please fill in all required fields"
        });
        return;
    }
    await globalStorage.initialize();
    await globalStorage.setInitialTime(initialTime);
    await globalStorage.setBuyingPeriod(buyingPeriod);
    await globalStorage.setPlayingStatus(playingStatus);
    await socketsStorage.initialize();
    await exchangesStorage.initialize();
    await ordersStorage.initialize();
    await stocksStorage.initialize();
    return res.send('OK');
});

router.post('/startTrading', checkIfDeveloper, async (req, res) => {
    await globalStorage.setPlayingStatus(true);
    await globalStorage.setBuyingPeriod(false);
    stocks.forEach((stock, stockIndex) => {
        let initial_quantity = stock.initialQuantity;
        let current_left_quantity = 0;
        stocksStorage.getStockQuantity(stockIndex)
            .then(q => { current_left_quantity = q; })
            .catch(console.log)
            .finally(() => {
                stocksStorage.setStockQuantity(stockIndex, initial_quantity - current_left_quantity);
            });
    })
    res.send('OK');
});

router.post('/break', checkIfDeveloper, (req, res) => {
    globalStorage.setPlayingStatus(false);
    res.send('OK');
});

router.post('/restart', checkIfDeveloper, (req, res) => {
    globalStorage.setPlayingStatus(true);
    res.send('OK');
});

router.post('restartBuyingPeriod', checkIfDeveloper, (req, res) => {
    globalStorage.setBuyingPeriod(true);
    res.send('OK');
});

router.post('/getMemory', checkIfDeveloper, (req, res) => {
    let result = {};
    stocksStorage.getStocksRaw()
        .then(stocks => result.stocks = stocks)
        .catch(err => result.stocks = err)
        .finally(() => {
            ordersStorage.getPendingOrders()
                .then(orders => result.orders = orders)
                .catch(err => result.orders = err)
                .finally(() => {
                    socketsStorage.getSockets()
                        .then(sockets => result.sockets = sockets)
                        .catch(err => result.sockets = err)
                        .finally(() => {
                            globalStorage.getGlobals()
                                .then(globals => result.globals = globals)
                                .catch(err => result.globals = err)
                                .finally(() => {
                                    exchangesStorage.getExchanges()
                                        .then(exchanges => result.exchanges = exchanges)
                                        .catch(err => result.exchanges = err)
                                        .finally(() => {
                                            res.json({
                                                ok: true,
                                                result
                                            });
                                        });
                                });
                        });
                });
        });
});

router.post('/getDB', checkIfDeveloper, (req, res) => {
    userModel.find({}, (err, users) => {
        res.json({
            err,
            users
        })
    })
});

module.exports = router;