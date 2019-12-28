// TODO Redis

const mongoose = require('mongoose');
const pendingOrdersModel = mongoose.model('vsm_pending_orders', mongoose.Schema({
    orderId: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    stockIndex: { type: Number, required: true },
    userId: { type: String, required: true },
}));

async function getPendingOrdersOfStock(stockIndex) {
    try {
        return await pendingOrdersModel.find({ stockIndex });
    } catch (err) {
        console.log(err);
        return [];
    }
}

function addPendingOrder(orderId, quantity, rate, stockIndex, userId) {
    const pendingOrder = new pendingOrdersModel({ orderId, quantity, rate, stockIndex, userId });
    pendingOrder.save()
        .then(_order => { })
        .catch(err => {
            console.log(err);
        });
}

function cancelPendingOder(stockIndex, orderId) {
    pendingOrdersModel.findOneAndDelete({ stockIndex, orderId }, (_err, _doc) => { });
}

function pendingOrderExecuted(stockIndex, orderId, quantity) {
    pendingOrdersModel.findOne({ stockIndex, orderId }, (err, order) => {
        if (err) {
            console.log(err);
        } else {
            if (order) {
                let q = order.quantity;
                if (q == quantity) {
                    cancelPendingOder(stockIndex, orderId);
                } else {
                    order.quantity -= quantity;
                    order.save()
                        .then(_order => { })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        }
    });
}

async function getPendingOrdersOfUser(userId) {
    try {
        return await pendingOrdersModel.find({ userId });
    } catch (err) {
        console.log(err);
        return [];
    }
}

module.exports = {
    getPendingOrdersOfUser,
    addPendingOrder,
    cancelPendingOder,
    pendingOrderExecuted,
    getPendingOrdersOfStock,
    pendingOrdersModel
}
