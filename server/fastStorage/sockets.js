const SOCKETS_KEY = 'vsm_sockets';

let instance;

function initSockets(redis_client) {
    instance = redis_client;
    instance.del(SOCKETS_KEY, '.')
        .then()
        .catch(e => console.log(e))
        .finally(() => {
            instance.set(SOCKETS_KEY, '.', {})
                .then()
                .catch(e => console.log(e));
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
    SOCKETS_KEY
}
