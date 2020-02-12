const express = require("express");

const router = express.Router();

const globalStorage = require('./fastStorage/globals');
const stocksStorage = require('./fastStorage/stocks');
const ordersStorage = require('./fastStorage/orders');
const socketStorage = require('./fastStorage/sockets');
const userModel = require('./models/users');
const auth = require('./auth');
const constants = require('./constants');
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
                    user.funds = constants.initialFunds;
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
    await socketStorage.initialize();
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
                console.log(initial_quantity, current_left_quantity);
                stocksStorage.setStockQuantity(stockIndex, Math.abs(initial_quantity - current_left_quantity));
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
                    socketStorage.getSockets()
                        .then(sockets => result.sockets = sockets)
                        .catch(err => result.sockets = err)
                        .finally(() => {
                            globalStorage.getGlobals()
                                .then(globals => result.globals = globals)
                                .catch(err => result.globals = err)
                                .finally(() => {
                                    res.json({
                                        ok: true,
                                        result
                                    })
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

router.post('/leaderboard', checkIfDeveloper, (req, res) => {
    res.json({
        ok: true,
        message: "Not yet implemented"
    })
});

module.exports = router;