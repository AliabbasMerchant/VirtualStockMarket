const Rejson = require('iorejson');
const redislock = require('redislock');
const instance = new Rejson();

async function f() {
    await instance.connect();
    redislock.setDefaults({
        timeout: 30000, // 30 seconds // more than enough time
        retries: 19,
        delay: 50
    });

    try {
        let lock = redislock.createLock(instance.client);
        await lock.acquire('some:lock');
        console.log("Acquired lock");
        setTimeout(async () => {
            try {
                await lock.release();
                console.log("Released lock");
            } catch (err) {
                console.log('1', err);
            };
        }, 2000);
    } catch (err) {
        console.log('1', err);
    }

    setTimeout(() => {
        let lock2 = redislock.createLock(instance.client);
        lock2.acquire('some:lock', (err) => {
            if (err) console.log('2', err);
            else {
                console.log("Acquired lock");
                setTimeout(() => {
                    lock2.release((err) => {
                        if (err) console.log('2', err);
                        else console.log("Released lock");
                    });
                }, 2000);
            }
        });
    }, 1000);
}

f().then().catch()
