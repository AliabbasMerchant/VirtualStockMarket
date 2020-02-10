const GLOBALS_KEY = 'vsm_globals';

instance = null;

function initGlobals(redis_client) {
    instance = redis_client;
}

async function initialize() {
    try {
        await instance.del(GLOBALS_KEY, '.');
    } catch (err) {
        // ignore
    }
    try {
        await instance.set(GLOBALS_KEY, '.', {});
    } catch (err) {
        console.log(err)
    }
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

function getBuyingPeriod() {
    return instance.get(GLOBALS_KEY, "START_PERIOD");
}

async function setBuyingPeriod(start_period) {
    try {
        await instance.set(GLOBALS_KEY, "START_PERIOD", start_period);
    } catch (err) {
        console.log(err);
    }
}

function getGlobals() {
    return instance.get(GLOBALS_KEY, ".");
}

module.exports = {
    initGlobals,
    getInitialTime,
    setInitialTime,
    getPlayingStatus,
    setPlayingStatus,
    getBuyingPeriod,
    setBuyingPeriod,
    getGlobals,
    initialize
}
