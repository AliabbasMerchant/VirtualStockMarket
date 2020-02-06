async function f() {
    const Rejson = require('iorejson');
    const instance = new Rejson();
    await instance.connect();

    console.log(await instance.del('asdf', '.'));

    let a = await instance.set('abcde', '.', {});
    console.log(a)

    await instance.set('abcde', 'a', {
        pq: 12
    });
    console.log(a)

    value = await instance.get('abcde', 'a["pq"]');
    console.log(value);
    return;
}

f().then().catch()
