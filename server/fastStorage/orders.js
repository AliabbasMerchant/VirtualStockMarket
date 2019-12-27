// TODO Redis

pendingOrders = []; // stockIndex: { orderId -> { quantity, rate, userId }}

function initPendingOrders() {
    pendingOrders = [];
    require('../stocks').forEach((_stock) => {
        pendingOrders.push([]);
    });
}

function getPendingOrders() {
    return pendingOrders;
}

function getPendingOrdersOfStock(stockIndex) {
    return (0 <= stockIndex <= pendingOrders.length) ? pendingOrders[stockIndex] : [];
}

function addPendingOrder(orderId, quantity, rate, stockIndex, userId) {
    if (0 <= stockIndex < pendingOrders.length) {
        pendingOrders[stockIndex][orderId] = { quantity, rate, userId };
        return true;
    } else {
        return false;
    }
}

function pendingOrderExecuted(stockIndex, orderId, quantity) {
    if (0 <= stockIndex < pendingOrders.length) {
        let q = pendingOrders[stockIndex][orderId];
        if(q === quantity) 
            delete pendingOrders[stockIndex][orderId];
        else 
            pendingOrders[stockIndex][orderId].quantity = q - quantity;
    }
}

function getOrder(stockIndex, orderId) {
    return (0 <= stockIndex < pendingOrders.length) ? pendingOrders[stockIndex][orderId] : null;
}

function getPendingOrdersOfUser(userId) {
    let orders = [];
    pendingOrders.forEach(ordersOfStock => {
        Object.keys(ordersOfStock).forEach((orderId) => {
            let order = ordersOfStock[orderId];
            if (order.userId === userId) {
                orders.push(order);
            }
        });
    });
    return orders;
}

module.exports = {
    initPendingOrders,
    getPendingOrders,
    getPendingOrdersOfStock,
    getPendingOrdersOfUser,
    addPendingOrder,
    getOrder,
    pendingOrderExecuted
}
