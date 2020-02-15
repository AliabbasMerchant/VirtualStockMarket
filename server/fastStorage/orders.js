const redislock = require('redislock');
const constants = require('../constants');
const ORDERS_KEY = 'vsm_pending_orders';

instance = null;

function initOrders(redis_client) {
    instance = redis_client;
    redislock.setDefaults({
        timeout: 30000, // 30 seconds // more than enough time
        retries: 19,
        delay: 50
    });
}

async function lock() {
    let lock = redislock.createLock(instance.client);
    await lock.acquire(constants.ordersLock);
    return lock;
}

async function unlock(lock) {
    try {
        await lock.release();
    } catch (err) {
        console.log('Could not unlock pendingOrders', err);
    };
}

async function initialize() {
    try {
        await instance.del(ORDERS_KEY, '.');
    } catch (err) {
        // ignore
    }
    try {
        await instance.set(ORDERS_KEY, '.', {});
    } catch (err) {
        console.log(err)
    }
}

async function addPendingOrder(orderId, quantity, rate, stockIndex, userId) {
    try {
        await instance.set(ORDERS_KEY, orderId, { quantity, rate, stockIndex, userId });
    } catch (error) {
        console.log('addPendingOrder', error);
    }
}

async function cancelPendingOrder(orderId) {
    try {
        return await instance.del(ORDERS_KEY, orderId);
    } catch (error) {
        console.log('cancelPendingOrder', error);
    }
}

async function pendingOrderExecuted(orderId, quantity) {
    try {
        let order = await instance.get(ORDERS_KEY, orderId);
        if (order) {
            let q = order.quantity;
            console.log(order, quantity);
            await cancelPendingOrder(orderId);
            if (q != quantity) {
                // selling: ok
                // buying: initial = -10 exec = -6, rem =  -10 - -6 = -10 + 6 = -4; ok
                order.quantity -= quantity;
                await addPendingOrder(orderId, order.quantity, order.rate, order.stockIndex, order.userId);
            }
        }
    } catch (err) {
        console.log('pendingOrderExecuted', err);
    }
}

function getPendingOrdersOfUser(userId) {
    return new Promise((resolve, reject) => {
        instance.get(ORDERS_KEY, '.')
            .then(orders => {
                let res = [];
                if (orders) {
                    Object.keys(orders).forEach(orderId => {
                        let order = orders[orderId];
                        if (order.userId == userId) {
                            order.orderId = orderId;
                            res.push(order);
                        }
                    });
                }
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getPendingOrdersList() {
    return new Promise((resolve, reject) => {
        instance.get(ORDERS_KEY, '.')
            .then(orders => {
                let res = [];
                if (orders) {
                    Object.keys(orders).forEach(orderId => {
                        let order = orders[orderId];
                        order.orderId = orderId;
                        res.push(order);
                    });
                }
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
    getPendingOrdersOfUser, // lock
    addPendingOrder, // lock
    cancelPendingOrder, // lock
    pendingOrderExecuted, // lock
    getPendingOrders,
    getPendingOrdersList, // lock
    initialize, // lock
    lock,
    unlock
}
