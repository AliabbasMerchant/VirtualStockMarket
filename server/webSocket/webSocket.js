const socketStorage = require('../fastStorage/sockets');
const constants = require('../constants');
const auth = require('../auth');

IO = null;
rejson_instance = null;

function init(io, rejson_client) {
    IO = io;
    rejson_instance = rejson_client;
    instance.client.on("message", (channel, message) => {
        message = JSON.parse(message);
        if (channel == constants.internalEventNotifyUser) {
            const { userSocketId, eventName, data } = message;
            IO.to(userSocketId).emit(eventName, data);
        } else if (channel == constants.internalEventNotifyEveryone) {
            const { eventName, data } = message;
            IO.emit(eventName, data);
        }
    })
    rejson_client.client.subscribe(constants.internalEventNotifyUser);
    rejson_client.client.subscribe(constants.internalEventNotifyEveryone);

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
    socketStorage.getUserSocketId(userId)
        .then(userSocketId => {
            if (userSocketId) {
                rejson_instance.client.publish(constants.internalEventNotifyUser, JSON.stringify({ userSocketId, eventName, data }));
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function messageToEveryone(eventName, data) {
    rejson_instance.client.publish(constants.internalEventNotifyEveryone, JSON.stringify({ eventName, data }));
}

module.exports = {
    init,
    messageToUser,
    messageToEveryone,
};
