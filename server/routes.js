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

router.use((req, _res, next) => {
    console.log(String(new Date()), req.url, req.body);
    next();
})

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

router.post('/getStocks', auth.checkIfAuthenticatedAndGetUserId, async (_req, res) => {
    let stocksData = [];
    stocksStorage.getStocks()
        .then(async (rates) => {
            let initialTime = Date.now() - 1000 * 60 * 2; // 2 mins ago (Some random safe time);
            try {
                initialTime = await globalStorage.getInitialTime();
            } catch (err) {
                // Hopefully wont happen
                console.log(err);
            }
            for (let stockIndex = 0; stockIndex < rates.length; stockIndex++) {
                try {
                    stocksData.push(stocks[stockIndex]);
                    stocksData[stockIndex].rate = rates[stockIndex].rate;
                    let ratesObject = await stocksStorage.getStockRatesObject(stockIndex);
                    let ratesObj = {};
                    Object.keys(ratesObject).forEach(timestamp => {
                        ratesObj[[timestamp - initialTime]] = ratesObject[timestamp];
                    })
                    stocksData[stockIndex].ratesObject = ratesObj;
                } catch (err) {
                    // Hopefully wont happen
                    console.log(err);
                }
            }
            res.json({
                ok: true,
                message: constants.defaultSuccessMessage,
                stocks: stocksData
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                ok: false,
                message: constants.defaultErrorMessage,
                stocks: stocksData
            });
        })
});

router.post('/getFunds', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    assets.getUserFunds(req.body.userId)
        .then(funds => {
            res.json({
                ok: true, message: constants.defaultSuccessMessage, funds
            });
        })
        .catch(err => {
            res.json({
                ok: false, message: err
            });
        });
});

router.post('/getExecutedOrders', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    const { userId } = req.body;
    userModel.findById(userId, (err, user) => {
        if (err || !user) {
            console.log(err);
            res.json({
                ok: false,
                message: "No such user",
            });
        } else {
            res.json({
                ok: true,
                message: constants.defaultSuccessMessage,
                executedOrders: user.executedOrders
            });
        }
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
    const { orderId, quantity, rate, stockIndex, userId } = req.body;
    if (!orderId || !quantity || !rate || !stockIndex) {
        if (stockIndex !== 0) {
            return res.json({
                ok: false,
                message: "Please fill in all required fields"
            });
        }
    }
    if (rate <= 0) {
        return res.json({
            ok: false,
            message: "Rate cannot be negative"
        });
    }
    stocksStorage.getStockRate(stockIndex)
        .then(currentRate => {
            let capValue = currentRate * constants.capFraction;
            if (currentRate - capValue <= rate && rate <= currentRate + capValue) {
                trader.tryToTrade(orderId, quantity, rate, stockIndex, userId, (ok, message) => {
                    res.json({
                        ok,
                        message
                    })
                });
            } else {
                return res.json({
                    ok: false,
                    message: "Rate cannot be so different from current market rate"
                });
            }
        })
        .catch(e => {
            console.log(e);
            return res.json({
                ok: false,
                message: constants.defaultErrorMessage
            });
        });
});

router.post('/getRatesObject/:stockIndex', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    const stockIndex = req.params.stockIndex;
    stocksStorage.getStockRatesObject(stockIndex)
        .then(ratesObject => {
            globalStorage.getInitialTime()
                .then(initialTime => {
                    let ratesObj = {};
                    Object.keys(ratesObject).forEach(timestamp => {
                        ratesObj[[timestamp - initialTime]] = ratesObject[timestamp];
                    });
                    ratesObject = ratesObj;
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    res.json({
                        ok: true,
                        message: constants.defaultSuccessMessage,
                        ratesObject
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.json({
                ok: false,
                message: constants.defaultErrorMessage,
                ratesObject: {}
            })
        });
});

router.post('/cancelOrder', auth.checkIfAuthenticatedAndGetUserId, async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        res.json({
            ok: false,
            message: "Please fill in all required fields"
        });
    } else {
        let ok = await pendingOrdersStorage.cancelPendingOrder(orderId);
        if (ok)
            res.json({
                ok: true,
                message: constants.defaultSuccessMessage
            });
        else {
            res.json({
                ok: false,
                message: "Order Already Placed"
            });
        }
    }
});

router.use('/dev', developer);

module.exports = router;
