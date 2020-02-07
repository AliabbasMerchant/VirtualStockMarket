const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Rejson = require('iorejson');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
} else {
    const compression = require('compression');
    const helmet = require('helmet');
    app.use(helmet());
    app.use(compression());
}

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: 'VSM',
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./webSocket/webSocket').init(io);

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);

const rejson_client = new Rejson();
rejson_client.connect();
rejson_client.on('connect', function () {
    console.log('Orders: Redis client connected');
    require('./fastStorage/globals').initGlobals(rejson_client);
    require('./fastStorage/globals').setInitialTime(Date.now());
    require('./fastStorage/orders').initOrders(rejson_client);
    require('./fastStorage/sockets').initSockets(rejson_client);
    require('./fastStorage/stocks').initStocks(rejson_client);
});
rejson_client.on('error', function (err) {
    console.log('Orders: Redis Error ' + err);
});

app.use('/', require('./routes'));

server.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Server started on ${process.env.IP} at port ${process.env.PORT}`)
});
