const mongoose = require('mongoose');

const constants = require('../constants');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    funds: { type: Number, required: true, default: Number(process.env.INITIAL_FUNDS) },
    executedOrders: [{
        orderId: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        stockIndex: { type: Number, required: true },
        tradeTime: { type: Date, default: Date.now },
        // changeRate: { type: Boolean, required: true, default: true }
    }],
});

module.exports = mongoose.model('vsm_users', userSchema);
