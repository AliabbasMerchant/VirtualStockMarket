const express = require('express');
const auth = require('./auth');

const stocks = require('./stocks');
const assets = require('./assets');
const stocksStorage = require('./fastStorage/stocks');
const pendingOrdersStorage = require('./fastStorage/orders');
const globalStorage = require('./fastStorage/globals');
const constants = require('./constants');
const trader = require('./trader');
const userModel = require('./models/users');
const developer = require('./developer');

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.json({
            ok: false,
            message: "Please fill in all required fields"
        });
        return;
    }
    userModel.findOne({ username }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({
                ok: false,
                message: "An error occurred while logging you in"
            });
            return;
        } if (!user) {
            res.json({
                ok: false,
                message: "This username is not registered"
            });
            return;
        } else {
            if (user.password == auth.hash(password)) {
                res.json({
                    ok: true,
                    message: "Successfully logged in",
                    userToken: auth.createUserToken(user._id)
                });
            } else {
                res.json({
                    ok: false,
                    message: "Invalid password"
                });
            }
        }
    });
});

router.post('/register', (req, res) => {
    const { name, username, password, password2 } = req.body;
    if (!name || !username || !password || !password2) {
        res.json({
            ok: false,
            message: "Please fill in all required fields"
        });
        return;
    }
    if (password !== password2) {
        res.json({
            ok: false,
            message: "Passwords do not match"
        });
        return;
    }
    userModel.findOne({ username }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({
                ok: false,
                message: "An error occurred while registering"
            });
            return;
        } if (user) {
            res.json({
                ok: false,
                message: "This username is already registered"
            });
            return;
        } else {
            const newUserModel = new userModel({ username, password: auth.hash(password), name });
            newUserModel.save()
                .then(_user => {
                    res.json({
                        ok: true,
                        message: "Successfully registered"
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        ok: false,
                        message: "An error occurred while registering"
                    });
                });
        }
    });
});

router.post('/getStocks', async (_req, res) => {
    try {
        let rates = await stocksStorage.getStocks();
        for (let i = 0; i < rates.length; i++) {
            stocks[i].rate = rates[i].rate;
        }
        res.json(stocks);
    } catch (err) {
        console.log(err);
    }
});

router.post('/getFunds', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    assets.getUserFundsAndHoldings(req.body.userId, (err, funds, _holdings) => {
        if (err) {
            res.json({
                ok: false, message: err
            });
        } else {
            res.json({
                ok: true, message: constants.defaultSuccessMessage, funds
            });
        }
    });
});

router.post('/getExecutedOrders', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    tradesModel.find().or([{ buyerId: userId }, { sellerId: userId }])
        .then(trades => {
            let executedOrders = [];
            trades.forEach(trade => {
                if (trade.sellerId == userId) {
                    trade.quantity *= -1;
                }
                executedOrders.push(trade);
            });
            if (trades.length == 0) {
                res.json({
                    ok: false,
                    message: "No such user",
                });
            } else {
                res.json({
                    ok: true,
                    message: constants.defaultSuccessMessage,
                    executedOrders
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                ok: false,
                message: "No such user",
            });
        });
});

router.post('/getPendingOrders', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    const userId = req.body.userId;
    pendingOrdersStorage.getPendingOrdersOfUser(userId)
        .then(pendingOrders => {
            res.json({
                ok: true,
                message: constants.defaultSuccessMessage,
                pendingOrders
            });
        }).catch(err => {
            console.log(err);
            res.json({
                ok: false,
                message: constants.defaultErrorMessage,
                pendingOrders: []
            });
        })
});

router.post('/placeOrder', auth.checkIfAuthenticatedAndGetUserId, async (req, res) => {
    // console.log("placeOrder", req.body);
    const { orderId, quantity, rate, stockIndex, userId } = req.body;
    if (!orderId || !quantity || !rate || !stockIndex) {
        if (stockIndex !== 0) {
            res.json({
                ok: false,
                message: "Please fill in all required fields"
            });
            return;
        }
    }
    trader.tryToTrade(orderId, quantity, rate, stockIndex, userId, (ok, message) => {
        res.json({
            ok,
            message
        })
    });
});

router.post('/getRateList/:stockIndex', (req, res) => {
    const stockIndex = req.params.stockIndex;
    stocksStorage.getStockRateList(stockIndex)
        .then(rateList => {
            globalStorage.getInitialTime
                .then(initialTime => {
                    for (let i = 0; i < rateList.length; i++) {
                        rateList[i].time = rateList[i].timestamp - initialTime;
                    };
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    res.json({
                        ok: true,
                        message: constants.defaultSuccessMessage,
                        rateList
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.json({
                ok: false,
                message: constants.defaultErrorMessage,
                rateList: []
            })
        });
});

router.post('/cancelOrder', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        res.json({
            ok: false,
            messge: "Please fill in all required fields"
        });
    } else {
        pendingOrdersStorage.cancelPendingOrder(orderId);
        res.json({
            ok: true,
            messge: constants.defaultSuccessMessage
        });
    }
});

router.use('/dev', developer);

module.exports = router;
