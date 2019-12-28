const { pendingOrdersModel } = require('./fastStorage/orders');
const { initStocks } = require('./fastStorage/stocks');
const { userSocketModel } = require('./fastStorage/users');
const userModel = require('./models/user');

async function initializer(_req, res) {
    try {
        console.log("pendingOrdersModel.deleteMany({})", await pendingOrdersModel.deleteMany({}));
        await initStocks();
        console.log("userSocketModel.deleteMany({})", await userSocketModel.deleteMany({}));
        let users = await userModel.find({});
        users.forEach(user => {
            user.executedOrders = [];
            user.save();
        });
        // console.log("userModel.deleteMany({})", await userModel.deleteMany({}));
        res.send("ok");
    } catch (err) {
        res.send(err);
    }
}

async function leaderboard(req, res) {

}

module.exports = {
    initializer,
    leaderboard
}