const Rejson = require('iorejson');

const GLOBALS_KEY = 'vsm_globals';

const instance = new Rejson();
instance.connect();

client.on('connect', function () {
    console.log('Globals: Redis client connected');
});
client.on('error', function (err) {
    console.log('Globals: Redis Error ' + err);
});

async function getInitialTime() {
    try {
        return await instance.get(GLOBALS_KEY, "INITIAL_TIME");
    } catch (err) {
        console.log(err);
        return 0;
    }
}

function setInitialTime(initial_time) {
    try {
        await instance.set(GLOBALS_KEY, "INITIAL_TIME", initial_time);
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    getInitialTime,
    setInitialTime  ,
    GLOBALS_KEY
}
