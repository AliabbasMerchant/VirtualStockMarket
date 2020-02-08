async function f() {
    const Rejson = require('iorejson');
    const instance = new Rejson();
    await instance.connect();

    instance.client.on("message", (channel, message) => {
        console.log(`Message on ${channel}: ${message}`);
        console.log(typeof message);
        message = JSON.parse(message);
        console.log(message.a);
        console.log(typeof message.a);
    })

    instance.client.subscribe("abc");

    return;
}

f().then().catch()
