// TODO Redis

const stocks = require('../stocks');

pendingOrders = [];

function initPendingOrders() {
    pendingOrders = [];
    stocks.forEach((stock) => {
        pendingOrders.push([]);
    });
}

function getPendingOrders() {
    return pendingOrders;
}

function getPendingOrdersOfStock(stockIndex) {
    return pendingOrders[stockIndex];
}

function getPendingOrdersOfUser(userId) {
    let orders = [];
    pendingOrders.forEach(ordersOfStock => {
        ordersOfStock.forEach(order => {
            if(order.userId == userId) {
                orders.push(order);
            }
        })
    });
    return orders;
}

module.exports = {
    initPendingOrders,
    getPendingOrders,
    getPendingOrdersOfStock,
    getPendingOrdersOfUser
}
