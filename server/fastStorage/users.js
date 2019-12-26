// TODO Redis

// userId -> socketId
users = {};

function getUserSocketId(userId) {
    return users.userId;
}

function setUserSocketId(userId, socketId) {
    users[userId] = socketId;
}

module.exports = {
    getUserSocketId,
    setUserSocketId,
}
