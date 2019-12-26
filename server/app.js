const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const constants = require('./constants');
const webSocketHandler = require('./webSocket/webSocket');

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: 'VSM',
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

webSocketHandler.init(io);

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

// app.use((req, res, next) => {
// res.locals.user = req.user;
// res.locals.PRESENT = constants.PRESENT;
// res.locals.ABSENT = constants.ABSENT;
// res.locals.MIN_DATE = constants.MIN_DATE;
// next();
// });

require('./fastStorage/stocks').initStockRates();

app.use('/', require('./routes'));

server.listen(process.env.PORT, process.env.IP);
