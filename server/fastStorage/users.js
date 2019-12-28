// TODO Redis

const mongoose = require('mongoose');
const userSocketModel = mongoose.model('vsm_user_socket', mongoose.Schema({
    userId: { type: String, required: true },
    socketId: { type: String, required: true },
}));

function initUser(userId, socketId) {
    setUserSocketId(userId, socketId);
}

async function getUserSocketId(userId) {
    try {
        let result = await userSocketModel.findOne({ userId });
        if (!result) return null;
        return result.socketId;
    } catch (err) {
        console.log(err);
        return null;
    }
}

function setUserSocketId(userId, socketId) {
    const userSocket = new userSocketModel({ userId, socketId });
    userSocket.save()
        .then(_user => { })
        .catch(err => {
            console.log(err);
        });
}

module.exports = {
    initUser,
    getUserSocketId,
    setUserSocketId,
}

// userSocketModel.deleteMany({}, (err) => console.log(err));
