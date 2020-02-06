const Rejson = require('iorejson');

const SOCKETS_KEY = 'vsm_sockets';

const instance = new Rejson();
instance.connect();

client.on('connect', function () {
    console.log('Sockets: Redis client connected');
});
client.on('error', function (err) {
    console.log('Sockets: Redis Error ' + err);
});

instance.set(SOCKETS_KEY, '.', {});

async function getUserSocketId(userId) {
    try {
        return await instance.get(SOCKETS_KEY, userId);
    } catch (err) {
        console.log(err);
        return null;
    }
}

function setUserSocketId(userId, socketId) {
    try {
        instance.set(SOCKETS_KEY, userId, socketId);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUserSocketId,
    setUserSocketId,
    SOCKETS_KEY
}
