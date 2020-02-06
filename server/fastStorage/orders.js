const Rejson = require('iorejson');

const ORDERS_KEY = 'vsm_pending_orders';

const instance = new Rejson();
instance.connect();

client.on('connect', function () {
    console.log('Orders: Redis client connected');
});
client.on('error', function (err) {
    console.log('Orders: Redis Error ' + err);
});

instance.set(ORDERS_KEY, '.', {});

async function getPendingOrdersOfStock(stockIndex) {
    try {
        let orders = await instance.get(ORDERS_KEY, '.');
        let res = [];
        Object.keys(orders).forEach(orderId => {
            let order = orders[orderId];
            if (order.stockIndex == stockIndex) {
                order.orderId = orderId;
                res.push(order);
            }
        });
        return res;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function addPendingOrder(orderId, quantity, rate, stockIndex, userId) {
    try {
        await instance.set(ORDERS_KEY, orderId, { quantity, rate, stockIndex, userId });
    } catch (error) {
        console.log(error);
    }
}

function cancelPendingOrder(orderId) {
    try {
        await instance.del(ORDERS_KEY, orderId);
    } catch (error) {
        console.log(error);
    }
}

function pendingOrderExecuted(orderId, quantity) {
    try {
        let order = await instance.get(ORDERS_KEY, orderId);
        let q = order.quantity;
        cancelPendingOrder(orderId);
        if (q != quantity) {
            order.quantity -= quantity;
            addPendingOrder(orderId, order.quantity, order.rate, order.stockIndex, order.userId);
        }
    } catch (err) {
        console.log(err);
    }
}

async function getPendingOrdersOfUser(userId) {
    try {
        let orders = await instance.get(ORDERS_KEY, '.');
        let res = [];
        Object.keys(orders).forEach(orderId => {
            let order = orders[orderId];
            if (order.userId == userId) {
                order.orderId = orderId;
                res.push(order);
            }
        });
        return res;
    } catch (err) {
        console.log(err);
        return [];
    }
}

module.exports = {
    getPendingOrdersOfUser,
    addPendingOrder,
    cancelPendingOrder,
    pendingOrderExecuted,
    getPendingOrdersOfStock,
    ORDERS_KEY
}
