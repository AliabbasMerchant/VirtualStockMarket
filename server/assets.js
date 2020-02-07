const tradesModel = require('./models/trades');
const constants = require('./constants');
const stocks = require('./stocks');

function getUserFundsAndHoldings(userId, callback) {
    tradesModel.find().or([{ buyerId: userId }, { sellerId: userId }])
        .then(trades => {
            let funds = constants.initialFunds;
            let holdings = [];
            for (let i = 0; i < stocks.length; i++) {
                holdings.push({ stockIndex: i, rate: 0, quantity: 0 });
            }
            trades.forEach(trade => {
                let i = trade.stockIndex;
                let brokerageFees = getBrokerageFees(trade.rate, trade.quantity);
                funds -= brokerageFees;
                if (trade.buyerId == userId) { // buyer
                    funds -= (trade.quantity * trade.rate);
                    let quantity = holdings[i].quantity + trade.quantity;
                    if (quantity !== 0) {
                        holdings[i].rate = (holdings[i].rate * holdings[i].quantity + trade.rate * trade.quantity) / (holdings[i].quantity + trade.quantity);
                    } else {
                        holdings[i].rate = 0;
                    }
                    holdings[i].quantity = quantity;
                } else { // seller
                    funds += (trade.quantity * trade.rate);
                    let quantity = holdings[i].quantity - trade.quantity;
                    if (quantity !== 0) {
                        holdings[i].rate = (holdings[i].rate * holdings[i].quantity - trade.rate * trade.quantity) / (holdings[i].quantity - trade.quantity);
                    } else {
                        holdings[i].rate = 0;
                    }
                    holdings[i].quantity = quantity;
                }
            });
            for (let i = 0; i < holdings.length; i++) {
                holdings[i].price = holdings[i].rate * holdings[i].quantity;
            };
            callback(null, funds, holdings);
        })
        .catch(err => {
            callback(err, null, null);
        });
}

function getBrokerageFees(ratePerShare, quantity) {
    return constants.brokerageRateFraction * ratePerShare * quantity;
}

module.exports = {
    getUserFundsAndHoldings,
    getBrokerageFees
};