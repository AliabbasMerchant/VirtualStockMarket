const usersStorage = require('../fastStorage/users');
const constants = require('../constants');
const auth = require('../auth');

IO = null;

function init(io) {
    IO = io;
    io.on('connection', function (socket) {
        socket.on(constants.eventNewClient, (data) => {
            auth.getUserIdFromToken(data.userToken, (err, userId) => {
                if (err) socket.disconnect();
                else {
                    usersStorage.initUser(userId, socket.id);
                    // messageToUser(userId, constants.eventStockRateUpdate, { stockIndex: 2, rate: 150 }); // For Testing
                }
            });
        });
    });
}

async function messageToUser(userId, eventName, data) {
    let userSocketId = await usersStorage.getUserSocketId(userId);
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
