const mongoose = require('mongoose');

const constants = require('../constants');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    funds: { type: Number, required: true, default: constants.initialFunds },
    executedOrders: {
        id: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        stockId: { type: Number, required: true }
    }
});

module.exports = mongoose.model('vsm_user', userSchema);
