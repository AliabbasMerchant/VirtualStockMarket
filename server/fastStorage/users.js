// TODO Redis

const userModel = require('../models/user');
const constants = require('../constants');

users = {}; // userId -> {socketId, funds}

function initUser(userId, socketId) {
    users[userId] = {};
    users[userId].socketId = socketId;
    getUserFunds(userId, (err, funds) => {
        if (!err) users[userId].funds = funds;
    })
}

function getUserSocketId(userId) {
    if (users[userId])
        return users[userId].socketId;
    return null;
}

function setUserSocketId(userId, socketId) {
    if (!users[userId]) {
        users[userId] = {};
    }
    users[userId].socketId = socketId;
}

function getUserFunds(userId, callback) {
    if (users[userId] && users[userId].funds) {
        callback(null, users[userId].funds);
    } else {
        userModel.findById(userId, (err, user) => {
            if (err) {
                console.log(err);
                callback("No such user", null);
            } else {
                let funds = constants.initialFunds;
                user.executedOrders.forEach(order => {
                    funds += (order.quantity * order.rate);
                });
                users[userId].funds = funds;
                callback(null, funds);
            }
        });
    }
}

function setUserFunds(userId, funds) {
    if(!users[userId]) {
        users[userId] = {};
    }
    users[userId].funds = funds;
}

module.exports = {
    initUser,
    getUserSocketId,
    setUserSocketId,
    getUserFunds,
    setUserFunds,
}
