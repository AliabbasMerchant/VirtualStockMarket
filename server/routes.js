const express = require('express');
const auth = require('./auth');

const router = express.Router();

router.get('/', (_req, res) => {
    res.send("VSM");
});

router.get('*', (_req, res) => {
    res.redirect('/');
});

module.exports = router;
