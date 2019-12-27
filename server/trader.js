const usersStorage = require('./fastStorage/users');
const stocksStorage = require('./fastStorage/stocks');
const pendingOrdersStorage = require('./fastStorage/orders');
const webSocketHandler = require('./webSocket/webSocket');
const constants = require('./constants');
const userModel = require('./models/user');

async function tryToTrade(orderId, quantity, rate, stockIndex, userId) {
    const currentTime = + new Date();
    if (currentTime <= constants.buyingTimeLimit) {
        if (quantity < 0) { // buying
            if (quantity + stocksStorage.getStockQuantity(stockIndex) >= 0) { // qtty less than total available quantity
                usersStorage.getUserFunds(userId, (err, funds) => {
                    if (err) {
                        webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
                    } else {
                        if (funds + (quantity * rate) - getBrokerageFees() >= 0) { // funds check
                            executeOrder(orderId, quantity, rate, stockIndex, userId, false);
                        } else {
                            webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Insufficient Funds", orderId });
                        }
                    }
                });
            } else {
                webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Quantity too high", orderId });
            }
        } else { // quantity >= 0 // selling
            webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Cannot sell in buying period", orderId });
        }
    } else if (constants.buyingTimeLimit < currentTime <= constants.breakTimeStart || constants.breakTimeEnd < currentTime <= constants.endTime) {
        trade(stockIndex, orderId);
    } else {
        webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Cannot trade in this period", orderId });
    }
}

async function executeOrder(orderId, quantity, rate, stockIndex, userId, changeRate) {
    // put into executed orders
    // delete from pendingOrders
    // change funds
    // change rate
    // notify user
    userModel.findById(userId, (err, user) => {
        if (err) {
            console.log(err);
            webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
        } else {
            user.executedOrders.push({ orderId, quantity, rate, stockIndex, changeRate });
            user.save((err, _user) => {
                if (err) {
                    console.log(err);
                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
                } else {
                    pendingOrdersStorage.pendingOrderExecuted(stockIndex, orderId);
                    usersStorage.getUserFunds(userId, (err, funds) => {
                        if (err) {
                            // cant do anything
                        } else {
                            usersStorage.setUserFunds(funds + (quantity * rate) - getBrokerageFees());
                            if (changeRate && quantity > 0) { // calc only on selling, otherwise we will end up at same price, for each pair of trades
                                let initialQuantity = stocksStorage.getInitialStockQuantity(stockIndex);
                                if (initialQuantity) {
                                    let currentRate = stocksStorage.getStockRate(stockIndex);
                                    if (currentRate) {
                                        let rateDiff = rate - currentRate;
                                        let newRate = currentRate + (rateDiff * quantity / initialQuantity);
                                        if (newRate !== currentRate) {
                                            stocksStorage.setStockRate(stockIndex, newRate);
                                            webSocketHandler.messageToEveryone(constants.eventStockRateUpdate, { stockIndex, rate: newRate });
                                        }
                                    } else {
                                        // cant do anything
                                    }
                                } else {
                                    // cant do anything
                                }
                            }
                        }
                        webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: true, message: constants.defaultSuccessMessage, orderId });
                    });
                }
            });
        }
    });
}

async function trade(stockIndex, orderId) {
    let order1 = pendingOrdersStorage.getOrder(stockIndex, orderId);
    let orders = pendingOrdersStorage.getPendingOrdersOfStock(stockIndex);
    orders.forEach(order2 => {
        if (order1.rate === order2.rate) {
            if (order1.quantity * order2.quantity < 0) { // any 1 one wants to sell and the other is buying
                let quantity = Math.min(Math.abs(order1.quantity), Math.abs(order2.quantity));
                let quantity1 = quantity * Math.sign(order1.quantity);
                let quantity2 = quantity * Math.sign(order2.quantity);
                executeOrder(order1.orderId, quantity1, order1.rate, stockIndex, order1.userId, true);
                executeOrder(order2.orderId, quantity2, order2.rate, stockIndex, order2.userId, true);
            }
        }
    });
}

function getBrokerageFees() {
    return constants.brokerageFees;
}

module.exports = {
    tryToTrade,
};