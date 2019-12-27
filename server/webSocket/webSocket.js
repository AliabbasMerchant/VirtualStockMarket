const usersStorage = require('../fastStorage/users');
const constants = require('../constants');

IO = null;

function init(io) {
    IO = io;
    io.on('connection', function (socket) {
        socket.on(constants.eventNewClient, (data) => {
            usersStorage.initUser(data.userId, socket.id);
            messageToUser(data.userId, constants.eventStockRateUpdate, { stockIndex: 2, rate: 150 });
        });
    });

}

function messageToUser(userId, eventName, data) {
    let userSocketId = usersStorage.getUserSocketId(userId);
    if (userSocketId) {
        IO.to(userSocketId).emit(eventName, data);
    }
}

function messageToEveryone(eventName, data) {
    IO.emit(eventName, data);
}

module.exports = {
    init,
    messageToUser,
    messageToEveryone,
};
