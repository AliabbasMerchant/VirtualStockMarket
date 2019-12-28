const express = require('express');
const auth = require('./auth');
const stocks = require('./stocks');
const assets = require('./assets');
const stocksStorage = require('./fastStorage/stocks');
const pendingOrdersStorage = require('./fastStorage/orders');
const constants = require('./constants');
const trader = require('./trader');
const userModel = require('./models/user');
const developer = require('./developer');

const router = express.Router();

router.get('/', (_req, res) => {
    res.send("VSM");
});

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
    let rates = await stocksStorage.getStocks();
    for (let i = 0; i < rates.length; i++) {
        stocks[i].rate = rates[i].rate;
    }
    res.json(stocks);
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
    userModel.findById(req.body.userId, (err, user) => {
        if (err || !user) {
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

router.post('/getPendingOrders', auth.checkIfAuthenticatedAndGetUserId, async (req, res) => {
    const userId = req.body.userId;
    res.json({
        ok: true,
        message: constants.defaultSuccessMessage,
        pendingOrders: await pendingOrdersStorage.getPendingOrdersOfUser(userId)
    });
});

if (constants.developer) {
    router.get('/getLeaderboard', developer.leaderboard);

    router.get('/initialize', developer.initializer);
}

router.post('/placeOrder', auth.checkIfAuthenticatedAndGetUserId, async (req, res) => {
    const { orderId, quantity, rate, stockIndex, userId } = req.body;
    // console.log("placeOrder", req.body);
    if (!orderId || !quantity || !rate || !stockIndex) {
        if (stockIndex !== 0) {
            res.json({
                ok: false,
                message: "Please fill in all required fields"
            });
            return;
        }
    }
    if (0 <= stockIndex < stocks.length) {
        if (quantity == 0) {
            res.json({
                ok: false,
                message: "Quantity cannot be zero"
            });
        } else {
            pendingOrdersStorage.addPendingOrder(orderId, quantity, rate, stockIndex, userId);
            trader.tryToTrade(orderId, quantity, rate, stockIndex, userId);
            res.json({
                ok: true,
                message: constants.defaultSuccessMessage
            });
        }
    } else {
        res.json({
            ok: false,
            message: "No such stock"
        });
    }
});

router.post('/cancelOrder', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    const { orderId, stockIndex } = req.body;
    if (!orderId || !stockIndex) {
        res.json({
            ok: false,
            messge: "Please fill in all required fields"
        });
    } else {
        pendingOrdersStorage.cancelPendingOder(stockIndex, orderId);
        res.json({
            ok: true,
            messge: constants.defaultSuccessMessage
        });
    }
});

router.get('*', (_req, res) => {
    res.redirect('/');
});

module.exports = router;
