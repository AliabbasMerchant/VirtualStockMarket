const stocksStorage = require('./fastStorage/stocks');
const userModel = require('./models/user');
const constants = require('./constants');

async function getUserFundsAndHoldings(userId, callback) {
    userModel.findById(userId, async (err, user) => {
        if (err) {
            console.log(err);
            callback("No such user", null);
        } else {
            let funds = constants.initialFunds;
            let holdings = [];
            let stocks = await stocksStorage.getStocks();
            stocks.forEach((_stock, stockIndex) => {
                holdings.push({ stockIndex, rate: 0, quantity: 0 });
            });
            user.executedOrders.forEach(order => {
                funds += (order.quantity * order.rate);
                funds -= getBrokerageFees(order.quantity);
                let i = order.stockIndex;
                let quantity = holdings[i].quantity + order.quantity;
                if(quantity !== 0) {
                    holdings[i].rate = (holdings[i].rate * holdings[i].quantity + order.rate * order.quantity) / (holdings[i].quantity + order.quantity);
                } else {
                    holdings[i].rate = 0;
                }
                holdings[i].quantity = quantity;
            });
            for (let i = 0; i < holdings.length; i++) {
                holdings[i].quantity *= -1;
                holdings[i].price = holdings[i].rate * holdings[i].quantity;
            };
            callback(null, funds, holdings);
        }
    });
}

function getBrokerageFees(quantity) {
    return constants.brokerageFees * quantity;
}

module.exports = {
    getUserFundsAndHoldings,
    getBrokerageFees
};