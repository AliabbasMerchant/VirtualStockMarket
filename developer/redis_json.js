async function f() {
    const Rejson = require('iorejson');
    const instance = new Rejson();
    await instance.connect();

    instance.client.publish("abc", JSON.stringify({ a: 2, b: false }));

    value = await instance.del('abcd', '.');
    console.log(value);
    // value = await instance.set('abcd', 'pqr', 123).then().catch(err=>console.log(err)).finally((c)=>console.log("a", c));
    // console.log(value);
    value = await instance.set('abcd', '.', {});
    console.log(value);
    // value = await instance.del('abcd', 'xyz');
    // console.log(value);
    value = await instance.get('abcd', 'pqr');
    console.log(value);
    value = await instance.del('abcd', 'pqr');
    console.log(value);
    value = await instance.set('abcd', 'pqr', 123);
    console.log(value);
    value = await instance.get('abcd', 'pqr');
    console.log(value);
    value = await instance.set('abcd', '.', { pqr: 456 });
    console.log(value);
    value = await instance.get('abcd', 'pqr');
    console.log(value);
    value = await instance.set('abcd', '.', {});
    console.log(value);
    value = await instance.get('abcd', '.');
    console.log(value);
    return;
}

f().then().catch()
