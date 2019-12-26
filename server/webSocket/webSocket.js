const users = require('../fastStorage/users');
const constants = require('../constants');

IO = null;

function init(io) {
    IO = io;
    io.on('connection', function (socket) {
        socket.on(constants.eventNewClient, (data) => {
            users.setUserSocketId(data.userId, socket.id);
        });

        setTimeout(() => {stockRateUpdate(2, 150)}, 7000);
    });
}

function stockRateUpdate(stockId, newRate) {
    IO.emit(constants.eventStockRateUpdate, { stockId, newRate });
}

module.exports = {
    init,
    stockRateUpdate
};
