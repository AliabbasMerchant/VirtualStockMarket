const assets = require('./assets');
const stocksStorage = require('./fastStorage/stocks');
const pendingOrdersStorage = require('./fastStorage/orders');
const globalStorage = require('./fastStorage/globals');
const webSocketHandler = require('./webSocket/webSocket');
const constants = require('./constants');
const userModel = require('./models/users');

// callback(ok, message)
function tryToTrade(orderId, quantity, rate, stockIndex, userId, callback) {
    const currentTime = Date.now();
    console.log("gotOrder", orderId, quantity, rate, stockIndex, userId, currentTime);
    if (quantity == 0) {
        return callback(false, "Quantity cannot be zero");
    }
    quantity = Math.abs(quantity);
    if (!(0 <= stockIndex < require('./stocks').length)) {
        return callback(false, "No such stock");
    }
    let playingStatus = false;
    globalStorage.getPlayingStatus()
        .then(status => playingStatus = status)
        .catch(console.log)
        .finally(() => {
            if (!playingStatus) {
                return callback(false, "Cannot trade in this period");
            }
            let buyingPeriod = false;
            globalStorage.getBuyingPeriod()
                .then(status => buyingPeriod = status)
                .catch(console.log)
                .finally(() => {
                    if (buyingPeriod) {
                        if (!buying) {
                            callback(false, "Cannot sell in buying period");
                        } else {
                            // buying, buy at price
                            okToTrade(orderId, quantity, rate, stockIndex, userId, buying, true);
                            callback(true, constants.defaultSuccessMessage);
                        }
                    } else { // normal trading, with user
                        okToTrade(orderId, quantity, rate, stockIndex, userId, buying, false);
                        callback(true, constants.defaultSuccessMessage);
                    }
                });
        });
}

function notifyUser(userId, event, payload) {
    webSocketHandler.messageToUser(userId, event, payload);
}

function notifyUsers(event, payload) {
    webSocketHandler.messageToEveryone(event, payload);
}

async function triggerOrderMatcher(stockIndex, userId) {
    // TODO Some message queue?
    orderMatcher(stockIndex, userId);
}

async function okToTrade(orderId, quantity, rate, stockIndex, userId, buying, buyFromMarket) {
    if (buyFromMarket) {
        // check funds and available stock quantity in market. If ok,trade it
        stocksStorage.getStockQuantity(stockIndex)
            .then(stockQuantity => {
                if (stockQuantity != null && stockQuantity >= quantity) { // qtty less than total available quantity
                    stocksStorage.getStockRate(stockIndex)
                        .then(stockRate => {
                            if (stockRate != null && rate == stockRate) {
                                assets.getUserFunds(userId, (err, funds) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        if (funds >= (stockRate * quantity + assets.getBrokerageFees(stockRate, quantity))) {
                                            executeOrder(orderId, quantity * -1, rate, stockIndex, userId, false, true);
                                        } else {
                                            notifyUser(userId, constants.eventOrderPlaced, { ok: false, message: "Insufficient Funds", orderId });
                                        }
                                    }
                                });
                            } else {
                                notifyUser(userId, constants.eventOrderPlaced, { ok: false, message: "In this period, you can only buy at market rate", orderId });
                            }
                        })
                        .catch(console.log);
                } else {
                    notifyUser(userId, constants.eventOrderPlaced, { ok: false, message: "Quantity too high", orderId });
                }
            })
            .catch(console.log);
    } else {
        if (buying) quantity *= -1; // set quantity to negative
        pendingOrdersStorage.addPendingOrder(orderId, quantity, rate, stockIndex, userId);
        triggerOrderMatcher(stockIndex, userId);
    }
}

async function executeOrder(orderId, quantity, rate, stockIndex, userId, changeRate = true, stockQuantityChange = false) {
    // put into executed orders
    // delete from pendingOrders
    // change stock quantity true/false
    // change rate true/false
    // notify user
    userModel.findById(userId, (err, user) => {
        if (err) {
            console.log(err);
            notifyUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
        } else {
            let fundsChange = quantity * rate - assets.getBrokerageFees(rate, quantity);
            user.funds += fundsChange;
            user.executedOrders.push({ orderId, quantity, rate, stockIndex, tradeTime: Date.now() });
            user.save((err, _user) => {
                if (err) {
                    console.log(err);
                    notifyUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
                } else {
                    if (changeRate && quantity > 0) { // calc only on selling, otherwise we will end up at same price, for each pair of trades
                        // will never occur in buying period. Always occurs in trading time
                        stocksStorage.getStockRate(stockIndex)
                            .then(currentRate => {
                                stocksStorage.getStockQuantity(stockIndex)
                                    .then(currentQuantity => {
                                        let rateDiff = rate - currentRate;
                                        let newRate = currentRate + (rateDiff * quantity / currentQuantity);
                                        if (newRate !== currentRate) {
                                            stocksStorage.setStockRate(stockIndex, newRate);
                                            notifyUsers(constants.eventStockRateUpdate, { stockIndex, rate: newRate });
                                        }
                                    })
                                    .catch(console.log("Danger", err)); // lets hope this never happens
                            })
                            .catch(console.log("Danger", err)); // lets hope this never happens
                    }
                    if (stockQuantityChange && quantity < 0) { // will occur only in buying period
                        stocksStorage.deductStockQuantity(stockIndex, quantity);
                    }
                    notifyUser(userId, constants.eventOrderPlaced, { ok: true, message: constants.defaultSuccessMessage, orderId, quantity, fundsChange });
                }
            });
        }
    });
}

async function sufficientFundsAndHoldings(userId, quantity, rate) {
    try {
        let funds = await assets.getUserFunds(userId);
        if (quantity < 0) { // buying
            return [funds >= (rate * Math.abs(quantity) + assets.getBrokerageFees(rate, quantity)), quantity];
        } else { // selling
            if (funds >= assets.getBrokerageFees(rate, quantity)) {
                let holdings = await assets.getUserHoldings(userId);
                if (holdings[stockIndex].quantity > 0) {
                    quantity = Math.min(holdings[stockIndex].quantity, quantity); // holdingsQtty is never -ve. And since it is selling, qtty is also not -ve.
                    return [true, quantity];
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    return [false, quantity];
}

async function orderMatcher(stockIndex, userId) {
    let someOrderHasExecuted = false;
    do {
        someOrderHasExecuted = false;
        try {
            let orders = await pendingOrdersStorage.getPendingOrders();
            console.log("ordersPool", orders);

            for (const param in { stockIndex, userId }) {
                const value = matcher[param];
                for (const order1 of orders) {
                    if (order1[param] == value) {
                        let ok, qtty1 = await sufficientFundsAndHoldings(order1.userId, order1.quantity, order1.rate);
                        if (ok) {
                            for (const order2 of orders) {
                                if (order2.rate === order1.rate && order2.stockIndex === order1.stockIndex && order1.userId !== order2.userId) {
                                    if (order1.quantity * order2.quantity < 0) { // one wants to sell and the other is buying
                                        let ok, qtty2 = await sufficientFundsAndHoldings(order2.userId, order2.quantity, order2.rate);
                                        if (ok) {
                                            let quantity = Math.min(Math.abs(qtty1), Math.abs(qtty2));
                                            let quantity1 = quantity * Math.sign(qtty1);
                                            let quantity2 = quantity * Math.sign(qtty2);
                                            executeOrder(order1.orderId, quantity1, order1.rate, stockIndex, order1.userId);
                                            pendingOrdersStorage.pendingOrderExecuted(order1.orderId, quantity);
                                            executeOrder(order2.orderId, quantity2, order2.rate, stockIndex, order2.userId);
                                            pendingOrdersStorage.pendingOrderExecuted(order2.orderId, quantity);
                                            // no need to triggerOrderMatcher again, because we have the do...while loop
                                            someOrderHasExecuted = true;
                                        }
                                    }
                                }
                                if (someOrderHasExecuted) break;
                            }
                        }
                    }
                    if (someOrderHasExecuted) break;
                }
                if (someOrderHasExecuted) break;
            }
        } catch (err) {
            console.log(err);
        }
    } while (someOrderHasExecuted);
}

module.exports = {
    tryToTrade,
};
