const assets = require('./assets');
const stocksStorage = require('./fastStorage/stocks');
const pendingOrdersStorage = require('./fastStorage/orders');
const webSocketHandler = require('./webSocket/webSocket');
const constants = require('./constants');
const userModel = require('./models/user');

async function tryToTrade(orderId, quantity, rate, stockIndex, userId) {
    console.log("gotOrder", orderId, quantity, rate, stockIndex, userId);
    if (0 <= stockIndex < stocksStorage.getStocks().length) {
        const currentTime = + new Date();
        if (currentTime <= constants.buyingTimeLimit || constants.buyingTimeLimit < currentTime <= constants.breakTimeStart || constants.breakTimeEnd < currentTime <= constants.endTime) {
            assets.getUserFundsAndHoldings(userId, (err, funds, holdings) => {
                if (err) {
                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
                } else {
                    if (funds + (quantity * rate) - assets.getBrokerageFees(quantity) >= 0) {
                        if (currentTime <= constants.buyingTimeLimit) {
                            if (quantity < 0) { // buying
                                if (quantity + stocksStorage.getStockQuantity(stockIndex) >= 0) { // qtty less than total available quantity
                                    if (rate === stocksStorage.getStockRate(stockIndex)) {
                                        executeOrder(orderId, quantity, rate, stockIndex, userId, false, true);
                                    } else {
                                        webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "In this period, you can only buy at market rate", orderId });
                                    }
                                } else {
                                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Quantity too high", orderId });
                                }
                            } else { // quantity >= 0 // selling
                                webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Cannot sell in buying period", orderId });
                            }
                        } else {
                            // check holdings
                            if (quantity > 0) { // selling
                                if (quantity <= holdings[stockIndex].quantity) {
                                    trade(stockIndex, orderId);
                                } else {
                                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "You don't have those many stocks. Short selling is not allowed", orderId });
                                }
                            } else {
                                trade(stockIndex, orderId);
                            }
                        }
                    } else {
                        webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Insufficient Funds", orderId });
                    }
                }
            });
        } else {
            webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Cannot trade in this period", orderId });
        }
    } else {
        webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "No such stock", orderId });
    }
}

async function executeOrder(orderId, quantity, rate, stockIndex, userId, changeRate = true, stockQuantityChange = false) {
    // * funds and holdings already checked
    // * stockIndex valid
    // put into executed orders
    // delete from pendingOrders
    // change stock quantity true/false
    // change rate true/false
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
                    pendingOrdersStorage.pendingOrderExecuted(stockIndex, orderId, quantity);
                    if (changeRate && quantity > 0) { // calc only on selling, otherwise we will end up at same price, for each pair of trades
                        let initialQuantity = stocksStorage.getInitialStockQuantity(stockIndex);
                        let currentRate = stocksStorage.getStockRate(stockIndex);
                        let rateDiff = rate - currentRate;
                        let newRate = currentRate + (rateDiff * quantity / initialQuantity);
                        if (newRate !== currentRate) {
                            stocksStorage.setStockRate(stockIndex, newRate);
                            webSocketHandler.messageToEveryone(constants.eventStockRateUpdate, { stockIndex, rate: newRate });
                        }
                    }
                    if (stockQuantityChange) {
                        stocksStorage.setStockQuantity(stockIndex, stocksStorage.getStockQuantity(stockIndex) + quantity);
                    }
                    let fundsChange = quantity * rate - assets.getBrokerageFees(quantity);
                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: true, message: constants.defaultSuccessMessage, orderId, quantity, fundsChange });
                }
            });
        }
    });
}

async function trade(stockIndex, orderId1) {
    let orders = pendingOrdersStorage.getPendingOrdersOfStock(stockIndex);
    console.log("ordersPool", orders);
    let order1 = orders[orderId1];
    Object.keys(orders).forEach(orderId2 => {
        let order2 = orders[orderId2];
        if (order1.rate === order2.rate) {
            if (order1.quantity * order2.quantity < 0) { // any 1 one wants to sell and the other is buying
                let quantity = Math.min(Math.abs(order1.quantity), Math.abs(order2.quantity));
                let quantity1 = quantity * Math.sign(order1.quantity);
                let quantity2 = quantity * Math.sign(order2.quantity);
                executeOrder(orderId1, quantity1, order1.rate, stockIndex, order1.userId);
                executeOrder(orderId2, quantity2, order2.rate, stockIndex, order2.userId);
            }
        }
    });
}

module.exports = {
    tryToTrade,
};