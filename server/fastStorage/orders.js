const ORDERS_KEY = 'vsm_pending_orders';

instance = null;

function initOrders(redis_client) {
    instance = redis_client;
}

function initialize() {
    instance.del(ORDERS_KEY, '.')
        .then()
        .catch(console.log)
        .finally(() => {
            instance.set(ORDERS_KEY, '.', {})
                .then()
                .catch(console.log);
        });
}

function getPendingOrdersOfStock(stockIndex) {
    return new Promise((resolve, reject) => {
        instance.get(ORDERS_KEY, '.')
            .then(orders => {
                let res = [];
                Object.keys(orders).forEach(orderId => {
                    let order = orders[orderId];
                    if (order.stockIndex == stockIndex) {
                        order.orderId = orderId;
                        res.push(order);
                    }
                });
                resolve(res);
            }).catch(err => {
                reject(err);
            });
    });
}

async function addPendingOrder(orderId, quantity, rate, stockIndex, userId) {
    try {
        await instance.set(ORDERS_KEY, orderId, { quantity, rate, stockIndex, userId });
    } catch (error) {
        console.log(error);
    }
}

async function cancelPendingOrder(orderId) {
    try {
        await instance.del(ORDERS_KEY, orderId);
    } catch (error) {
        console.log(error);
    }
}

async function pendingOrderExecuted(orderId, quantity) {
    try {
        let order = await instance.get(ORDERS_KEY, orderId);
        let q = order.quantity;
        await cancelPendingOrder(orderId);
        if (q != quantity) {
            // selling: ok
            // buying: initial = -10 exec = -6, rem =  -10 - -6 = -10 + 6 = -4; ok
            order.quantity -= quantity;
            await addPendingOrder(orderId, order.quantity, order.rate, order.stockIndex, order.userId);
        }
    } catch (err) {
        console.log(err);
    }
}

function getPendingOrdersOfUser(userId) {
    return new Promise((resolve, reject) => {
        instance.get(ORDERS_KEY, '.')
        .then(orders => {
            let res = [];
            Object.keys(orders).forEach(orderId => {
                let order = orders[orderId];
                if (order.userId == userId) {
                    order.orderId = orderId;
                    res.push(order);
                }
            });
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
}

function getPendingOrders() {
    return instance.get(ORDERS_KEY, '.');
}

module.exports = {
    initOrders,
    getPendingOrdersOfUser,
    addPendingOrder,
    cancelPendingOrder,
    pendingOrderExecuted,
    getPendingOrdersOfStock,
    getPendingOrders,
    initialize
}
