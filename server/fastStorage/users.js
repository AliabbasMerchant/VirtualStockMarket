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
    userSocketModel.findOne({ userId }, (err, socketModel) => {
        if (err) {
            console.log(err);
        } else {
            if (socketModel) {
                socketModel.socketId = socketId;
                socketModel.save()
                    .then(_socketModel => { })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                const socketModel = new userSocketModel({ socketId, userId });
                socketModel.save().then(_socketModel => { }).catch(err => console.log(err));
            }
        }
    });
}

module.exports = {
    initUser,
    getUserSocketId,
    setUserSocketId,
    userSocketModel
}
