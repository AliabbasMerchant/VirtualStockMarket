const socketStorage = require('../fastStorage/sockets');
const constants = require('../constants');
const auth = require('../auth');

IO = null;

function init(io) {
    IO = io;
    io.on('connection', function (socket) {
        socket.on(constants.eventNewClient, (data) => {
            console.log(constants.eventNewClient, data);
            auth.getUserIdFromToken(data.userToken, (err, userId) => {
                if (err) {
                    console.log(err);
                    socket.disconnect();
                } else {
                    socketStorage.setUserSocketId(userId, socket.id);
                    messageToUser(userId, constants.eventStockRateUpdate, { stockIndex: 2, rate: 150 }); // For Testing
                }
            });
        });
    });
}

function messageToUser(userId, eventName, data) {
    // TODO PubSub
    socketStorage.getUserSocketId(userId)
        .then(userSocketId => {
            if (userSocketId) {
                IO.to(userSocketId).emit(eventName, data);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function messageToEveryone(eventName, data) {
    // TODO PubSub
    IO.emit(eventName, data);
}

module.exports = {
    init,
    messageToUser,
    messageToEveryone,
};
