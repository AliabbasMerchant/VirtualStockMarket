const SOCKETS_KEY = 'vsm_sockets';

instance = null;

function initSockets(redis_client) {
    instance = redis_client;
}

function initialize() {
    instance.del(SOCKETS_KEY, '.')
        .then()
        .catch(console.log)
        .finally(() => {
            instance.set(SOCKETS_KEY, '.', {})
                .then()
                .catch(console.log);
        });
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

module.exports = {
    initSockets,
    getUserSocketId,
    setUserSocketId,
    initialize
}
