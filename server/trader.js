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
                            return callback(false, "Cannot sell in buying period");
                        } else {
                            // buying, buy at price
                            okToTrade(orderId, quantity, rate, stockIndex, userId, buying, true);
                            return callback(true, constants.defaultSuccessMessage);
                        }
                    }
                    // normal trading, with user
                    okToTrade(orderId, quantity, rate, stockIndex, userId, buying, false);
                    return callback(true, constants.defaultSuccessMessage);
                });
        });
}

function notifyUser(userId, event, payload) {
    webSocketHandler.messageToUser(userId, event, payload);
}

function notifyUsers(event, payload) {

}

function okToTrade(orderId, quantity, rate, stockIndex, userId, buying, buyFromMarket) {
    if (buyFromMarket) {
        // check funds and available stock quantity in market. If ok, just trade it
        stocksStorage.getStockQuantity(stockIndex)
            .then(stockQuantity => {
                if (stockQuantity != null && stockQuantity >= quantity) { // qtty less than total available quantity
                    stocksStorage.getStockRate(stockIndex)
                        .then(stockRate => {
                            if (stockRate != null) {
                                if (rate == stockRate) {
                                    executeOrder(orderId, quantity, rate, stockIndex, userId, false, true);
                                } else {
                                    notifyUser(userId, constants.eventOrderPlaced, { ok: false, message: "In this period, you can only buy at market rate", orderId });
                                }
                            }
                        })
                        .catch(console.log);
                } else {
                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Quantity too high", orderId });
                }
            })
            .catch(console.log)
    } else {
        // put in trader
    }
    if (buying) {

    } else {
        // check holdings
        if (quantity > 0) { // selling
            if (quantity <= holdings[stockIndex].quantity) {
                await pendingOrdersStorage.addPendingOrder(orderId, quantity, rate, stockIndex, userId);
                trade(stockIndex, orderId);
            } else {
                webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "You don't have those many stocks. Short selling is not allowed", orderId });
            }
        } else {
            await pendingOrdersStorage.addPendingOrder(orderId, quantity, rate, stockIndex, userId);
            trade(stockIndex, orderId);
        }
    }
    // Not here
    let buying = quantity < 0;
    assets.getUserFundsAndHoldings(userId, (err, funds, holdings) => {
        if (err) {
            console.log(err);
            webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
        } else {
            let fundsOk = false;
            if (buying) {
                // check
                fundsOk = funds >= (rate * quantity) + assets.getBrokerageFees(rate, quantity);
            } else { // selling
                // no need to check funds, except for brokerageFees
                fundsOk = funds >= assets.getBrokerageFees(rate, quantity);
            }
            if (fundsOk) {

            } else {
                webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: "Insufficient Funds", orderId });
            }
        }
    });
}

async function executeOrder(orderId, quantity, rate, stockIndex, userId, changeRate = true, stockQuantityChange = false) {
    // * funds and holdings already checked
    // * stockIndex valid
    // put into executed orders
    // delete from pendingOrders
    // change stock quantity true/false
    // change rate true/false
    // notify user
    userModel.findById(userId, async (err, user) => {
        if (err) {
            console.log(err);
            webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
        } else {
            user.executedOrders.push({ orderId, quantity, rate, stockIndex, changeRate });
            user.save(async (err, _user) => {
                if (err) {
                    console.log(err);
                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: false, message: constants.defaultErrorMessage, orderId });
                } else {
                    pendingOrdersStorage.pendingOrderExecuted(orderId, quantity);
                    if (changeRate && quantity > 0) { // calc only on selling, otherwise we will end up at same price, for each pair of trades
                        let initialQuantity = stocksStorage.getInitialStockQuantity(stockIndex);
                        // should never be null. Hence, not checking if(null)
                        let currentRate = await stocksStorage.getStockRate(stockIndex);
                        let rateDiff = rate - currentRate;
                        let newRate = currentRate + (rateDiff * quantity / initialQuantity);
                        if (newRate !== currentRate) {
                            stocksStorage.setStockRate(stockIndex, newRate);
                            webSocketHandler.messageToEveryone(constants.eventStockRateUpdate, { stockIndex, rate: newRate });
                        }
                    }
                    if (stockQuantityChange) {
                        let stockQuantity = await stocksStorage.getStockQuantity(stockIndex);
                        if (stockQuantity != null) {
                            stocksStorage.setStockQuantity(stockIndex, stockQuantity + quantity);
                        }
                    }
                    let fundsChange = quantity * rate - assets.getBrokerageFees(quantity);
                    webSocketHandler.messageToUser(userId, constants.eventOrderPlaced, { ok: true, message: constants.defaultSuccessMessage, orderId, quantity, fundsChange });
                }
            });
        }
    });
}

async function trade(stockIndex, orderId) {
    let orders = await pendingOrdersStorage.getPendingOrdersOfStock(stockIndex);
    console.log("ordersPool", orders);
    for (let i = 0; i < orders.length; i++) {
        let order1 = orders[i];
        if (order1.orderId == orderId) {
            for (let j = 0; j < orders.length; j++) {
                let order2 = orders[j];
                if (j != i && order2.rate == order1.rate) {
                    if (order1.quantity * order2.quantity < 0) { // any 1 one wants to sell and the other is buying
                        let quantity = Math.min(Math.abs(order1.quantity), Math.abs(order2.quantity));
                        let quantity1 = quantity * Math.sign(order1.quantity);
                        let quantity2 = quantity * Math.sign(order2.quantity);
                        executeOrder(order1.orderId, quantity1, order1.rate, stockIndex, order1.userId);
                        executeOrder(order2.orderId, quantity2, order2.rate, stockIndex, order2.userId);
                    }
                }
            }
            break;
        }
    }
}

module.exports = {
    tryToTrade,
};