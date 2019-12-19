function webSocketHandler(io) {
    io.on('connection', function (socket) {
        console.log("A client connected", socket.id);
        // socket.emit('news', { hello: 'world' });
        // socket.on('my other event', function (data) {
        //     console.log(data);
        // });
    });
}

module.exports = webSocketHandler;
