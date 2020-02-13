const constants = require('../constants');

const EXCHANGES_KEY = 'vsm_exchanges';

instance = null;

function initExchanges(redis_client) {
    instance = redis_client;
}

async function initialize() {
    try {
        await instance.del(EXCHANGES_KEY, '.');
    } catch (err) {
        // ignore
    }
    try {
        await instance.set(EXCHANGES_KEY, '.', {});
    } catch (err) {
        console.log(err)
    }
}

async function usersCanExchange(userId1, userId2, quantity, update=false) { // this should never throw an error
    async function checkIfPossible(key, exchanges) { // this should never throw an error
        // This logic is a bit relaxed. If 2 users have exchanged 49 shares and limit is 50,
        // then they will be able to do a last exchange, of how many ever shares they want.
        // if(exchanges >= constants.exchangeLimit) { // relaxed
        if(exchanges + 1 >= constants.exchangeLimit) { // strict
            return false;
        } else {
            if(update) {
                // exchanges += quantity;
                exchanges += 1;
                try {
                    await instance.set(EXCHANGES_KEY, key, exchanges);
                } catch (err) {
                    console.log(err);
                }
            }
            return true;
        }
    }
    let keys = [userId1 + "&" + userId2, userId2 + "&" + userId1];
    try {
        let exchanges = await instance.get(EXCHANGES_KEY, keys[0]);
        return await checkIfPossible(keys[0], exchanges);
    } catch (error) {
        // this means that the key does not exist
        // console.log(error);
        try {
            let exchanges = await instance.get(EXCHANGES_KEY, keys[1]);
            return await checkIfPossible(keys[1], exchanges);
        } catch (error) {
            // this means that the key does not exist
            // console.log(error);
            return await checkIfPossible(keys[1], 0);
        }
    }
}

function getExchanges() {
    return instance.get(EXCHANGES_KEY, ".");
}

module.exports = {
    initExchanges,
    initialize,
    usersCanExchange,
    getExchanges,
}
