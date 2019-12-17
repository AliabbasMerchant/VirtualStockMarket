const express = require('express');
const auth = require('./auth');
const userModel = require('./models/user');
const stocks = require('./stocks');

const router = express.Router();

router.get('/', (_req, res) => {
    res.send("VSM");
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.json({
            ok: false,
            message: "Please fill in all required fields"
        });
        return;
    }
    userModel.findOne({ username }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({
                ok: false,
                message: "An error occurred while logging you in"
            });
            return;
        } if (!user) {
            res.json({
                ok: false,
                message: "This username is not registered"
            });
            return;
        } else {
            if (user.password === auth.hash(password)) {
                res.json({
                    ok: true,
                    message: "Successfully logged in",
                    userToken: auth.createUserToken(user._id)
                });
            } else {
                res.json({
                    ok: false,
                    message: "Invalid password"
                });
            }
        }
    });
});

router.post('/register', (req, res) => {
    const { name, username, password, password2 } = req.body;
    if (!name || !username || !password || !password2) {
        res.json({
            ok: false,
            message: "Please fill in all required fields"
        });
        return;
    }
    if (password !== password2) {
        res.json({
            ok: false,
            message: "Passwords do not match"
        });
        return;
    }
    userModel.findOne({ username }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({
                ok: false,
                message: "An error occurred while registering"
            });
            return;
        } if (user) {
            res.json({
                ok: false,
                message: "This username is already registered"
            });
            return;
        } else {
            const newUserModel = new userModel({ username, password: auth.hash(password), name });
            newUserModel.save()
                .then(_user => {
                    res.json({
                        ok: true,
                        message: "Successfully registered"
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        ok: false,
                        message: "An error occurred while registering"
                    });
                });
        }
    });
});

router.get('*', (_req, res) => {
    res.redirect('/');
});

router.post('/stocks', auth.checkIfAuthenticatedAndGetUserId, (req, res) => {
    res.json(stocks);
});

module.exports = router;
