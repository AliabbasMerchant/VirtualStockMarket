const GLOBALS_KEY = 'vsm_globals';

instance = null;

function initGlobals(redis_client) {
    instance = redis_client;
}

function initialize() {
    instance.del(GLOBALS_KEY, '.')
        .then()
        .catch(console.log)
        .finally(() => {
            instance.set(GLOBALS_KEY, '.', {})
                .then()
                .catch(console.log);
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

function getPlayingStatus() {
    return instance.get(GLOBALS_KEY, "PLAYING_STATUS");
}

async function setPlayingStatus(status) {
    try {
        await instance.set(GLOBALS_KEY, "PLAYING_STATUS", status);
    } catch (err) {
        console.log(err);
    }
}

function getStartPeriod() {
    return instance.get(GLOBALS_KEY, "START_PERIOD");
}

async function setStartPeriod(start_period) {
    try {
        await instance.set(GLOBALS_KEY, "START_PERIOD", start_period);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    initGlobals,
    getInitialTime,
    setInitialTime,
    getPlayingStatus,
    setPlayingStatus,
    getStartPeriod,
    setStartPeriod,
    initialize
}
