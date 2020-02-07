const GLOBALS_KEY = 'vsm_globals';

let instance;

function initGlobals(redis_client) {
    instance = redis_client;
    instance.del(GLOBALS_KEY, '.')
        .then()
        .catch(e => console.log(e))
        .finally(() => {
            instance.set(GLOBALS_KEY, '.', {})
                .then()
                .catch(e => console.log(e));
        });
}

function getInitialTime() {
    return instance.get(GLOBALS_KEY, "INITIAL_TIME");
}

async function setInitialTime(initial_time) {
    try {
        await instance.set(GLOBALS_KEY, "INITIAL_TIME", initial_time);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    initGlobals,
    getInitialTime,
    setInitialTime,
    GLOBALS_KEY
}
