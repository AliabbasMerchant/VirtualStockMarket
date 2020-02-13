const socketStorage = require('./fastStorage/sockets');
const constants = require('./constants');
const auth = require('./auth');

IO = null;
rejson_instance = null;

function init(io, rejson_client, rejson_subs_client) {
    IO = io;
    rejson_instance = rejson_client;
    rejson_subs_client.client.on("message", (channel, message) => {
        message = JSON.parse(message);
        if (channel == constants.internalEventNotifyUser) {
            const { userSocketId, eventName, data } = message;
            console.log('notifyUser', userSocketId, eventName, data);
            IO.to(userSocketId).emit(eventName, data);
        } else if (channel == constants.internalEventNotifyEveryone) {
            const { eventName, data } = message;
            console.log('notifyEveryone', eventName, data);
            IO.emit(eventName, data);
        }
    })
    rejson_subs_client.client.subscribe(constants.internalEventNotifyUser);
    rejson_subs_client.client.subscribe(constants.internalEventNotifyEveryone);

    io.on('connection', function (socket) {
        socket.on(constants.eventNewClient, (data) => {
            console.log(constants.eventNewClient, data);
            if (data.userToken) {
                auth.getUserIdFromToken(data.userToken, (err, userId) => {
                    if (err) {
                        console.log(err);
                        socket.disconnect();
                    } else {
                        socketStorage.setUserSocketId(userId, socket.id);
                        /*
                        // Testing
                        // setTimeout(()=> {
                        //     messageToUser(userId, constants.eventOrderPlaced, {ok: true, message: constants.defaultSuccessMessage, orderId: "5", quantity: 2, funds: 49980})
                        // }, 2500);
                        for (let index = 0; index < 10; index++) {
                            setTimeout(() => {
                                if(index != 0)
                                    messageToUser(userId, constants.eventStockRateUpdate, {stockIndex:4, rate: index*1+910, time: index*20000});
                            }, 2000*index);
                        }
                        // */
                    }
                });
            }
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
