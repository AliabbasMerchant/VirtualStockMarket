async function f() {
  const Rejson = require('iorejson');
  const instance = new Rejson();
  await instance.connect();

  // instance.client.publish("abc", JSON.stringify({ a: 2, b: false }));

  var client = instance.client;
  var lock = require('redislock').createLock(client, {
    timeout: 20000,
    retries: 3,
    delay: 100
  });

  lock.acquire('some:lock', function (err) {
    if (err) console.log(err);
    else {
      console.log("Acquired lock");
      setTimeout(() => {
        lock.release(function (err) {
          if (err) console.log(err);
          else console.log("Released lock");
        });
      }, 2000);
    }
  });
  console.log("Something")
}

f().then().catch()
