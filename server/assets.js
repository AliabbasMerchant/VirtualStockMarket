const userModel = require('./models/users');
const constants = require('./constants');
const stocks = require('./stocks');

function getUserFunds(userId) {
    return new Promise((resolve, reject) => {
        userModel.findById(userId, (err, user) => {
            if (err || !user) {
                if(err)
                    console.log(err);
                reject("No Such User");
            } else {
                resolve(user.funds);
            }
        });
    });
}

function getUserHoldings(userId) {
    return new Promise((resolve, reject) => {
        userModel.findById(userId, (err, user) => {
            if (err || !user) {
                if(err)
                    console.log(err);
                reject("No such user");
            } else {
                let holdings = [];
                stocks.forEach((_stock, stockIndex) => {
                    holdings.push({ stockIndex, rate: 0, quantity: 0 });
                });
                user.executedOrders.forEach(order => {
                    let i = order.stockIndex;
                    let quantity = holdings[i].quantity + order.quantity;
                    if (quantity !== 0) {
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
                resolve(holdings);
            }
        });
    });
}

function getBrokerageFees(ratePerShare, quantity) {
    return Math.abs(constants.brokerageRateFraction * ratePerShare * quantity);
}

module.exports = {
    getUserFunds,
    getUserHoldings,
    getBrokerageFees
};