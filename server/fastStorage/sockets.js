const SOCKETS_KEY = 'vsm_sockets';

instance = null;

function initSockets(redis_client) {
    instance = redis_client;
}

async function initialize() {
    try {
        await instance.del(SOCKETS_KEY, '.');
    } catch (err) {
        // ignore
    }
    try {
        await instance.set(SOCKETS_KEY, '.', {});
    } catch (err) {
        console.log(err)
    }
}

function getUserSocketId(userId) {
    return instance.get(SOCKETS_KEY, userId);
}

async function setUserSocketId(userId, socketId) {
    try {
        await instance.set(SOCKETS_KEY, userId, socketId);
    } catch (error) {
        console.log(error);
    }
}

function getSockets() {
    return instance.get(SOCKETS_KEY, ".");
}

module.exports = {
    initSockets,
    getUserSocketId,
    setUserSocketId,
    getSockets,
    initialize
}
