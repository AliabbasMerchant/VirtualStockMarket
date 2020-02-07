const ORDERS_KEY = 'vsm_pending_orders';

let instance;

function initOrders(redis_client) {
    instance = redis_client;
    instance.del(ORDERS_KEY, '.')
        .then()
        .catch(e => console.log(e))
        .finally(() => {
            instance.set(ORDERS_KEY, '.', {})
                .then()
                .catch(e => console.log(e));
        });
}

async function getPendingOrdersOfStock(stockIndex) {
    return new Promise(async (resolve, reject) => {
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
        } catch (err) {
            console.log(err);
            return [];
        }
        try {
            let res = await instance.get(STOCKS_KEY, stockIndex);
            if (!res.rateList) {
                reject("No such stock");
            } else {
                resolve(res.rateList);
            }
        } catch (err) {
            reject(err);
        }
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
            order.quantity -= quantity;
            await addPendingOrder(orderId, order.quantity, order.rate, order.stockIndex, order.userId);
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
    initOrders,
    getPendingOrdersOfUser,
    addPendingOrder,
    cancelPendingOrder,
    pendingOrderExecuted,
    getPendingOrdersOfStock,
    ORDERS_KEY
}
