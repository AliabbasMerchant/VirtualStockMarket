async function f() {
    const Rejson = require('iorejson');
    const instance = new Rejson();
    await instance.connect();

    value = await instance.get('vsm_globals', '.');
    console.log(value);
    value = await instance.get('vsm_pending_orders', '.');
    console.log(value);
    value = await instance.get('vsm_stocks', '.');
    console.log(value);
    value = await instance.get('vsm_sockets', '.');
    console.log(value);
}

f().then().catch()
