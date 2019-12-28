// TODO Redis

users = {}; // userId -> socketId

function initUser(userId, socketId) {
    users[userId] = socketId;
}

function getUserSocketId(userId) {
    return users[userId];
}

function setUserSocketId(userId, socketId) {
    users[userId] = socketId;
}

module.exports = {
    initUser,
    getUserSocketId,
    setUserSocketId,
}
