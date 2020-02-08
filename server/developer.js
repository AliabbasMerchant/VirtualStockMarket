const express = require("express");

const router = express.Router();

const globalStorage = require('./fastStorage/globals');
const stocksStorage = require('./fastStorage/stocks');
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

router.post('/init', checkIfDeveloper, (req, res) => {
    // clear all storage
    // init memory
    // set initial time
    // set buyingPeriod to true
    // set playing to true
    const { safe } = req.body;
    if (!safe) {
        userModel.deleteMany({}).then().catch(console.log);
    } else {
        userModel.find({})
            .then(users => {
                users.forEach(user => {
                    user.executedOrders = [];
                    user.save();
                });
            })
            .catch(console.log);
    }
    require('./fastStorage/orders').initialize();
    require('./fastStorage/sockets').initialize();
    stocksStorage.initialize();
    globalStorage.initialize();
    globalStorage.setInitialTime(Date.now());
    globalStorage.setBuyingPeriod(true);
    globalStorage.setPlayingStatus(true);
    res.send('OK');
});

router.post('/startTrading', checkIfDeveloper, (req, res) => {
    userModel.find({})
        .then(users => {
            users.forEach(user => {
                user.executedOrders = [];
                user.save();
            });
        })
        .catch(console.log);
    globalStorage.setPlayingStatus(true);
    globalStorage.setBuyingPeriod(false);
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

router.post('/leaderboard', checkIfDeveloper, (req, res) => {
    res.json({
        ok: true,
        message: "Not yet implemented"
    })
});

module.exports = router;