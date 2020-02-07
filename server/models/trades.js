const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
    orderId: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    stockIndex: { type: Number, required: true }, // TODO Shift to DB?
    tradeTime: { type: Date, default: Date.now },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "vsm_user", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "vsm_user", required: true },
});

module.exports = mongoose.model('vsm_trades', tradeSchema);
