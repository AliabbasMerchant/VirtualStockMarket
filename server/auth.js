const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function hash(text) {
    return crypto.createHash('sha256').update(text).digest('base64');
}

function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
}

// function handler(err, decoded);
function verifyToken(token, handler) {
    jwt.verify(token, process.env.JWT_SECRET, handler);
}

function createUserToken(userId) {
    return createToken({ userId });
}

// function handler(err, userId);
function getUserIdFromToken(token, handler) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) handler(err, undefined);
        else handler(null, decoded.userId);
    });
}

function checkIfAuthenticatedAndGetUserId(req, res, next) {
    const { userToken } = req.body;
    verifyToken(userToken, (err, decoded) => {
        if(err) {
            console.log(err);
            res.json({
                ok: false,
                message: "Please login to access this feature",
            });
        } else {
            req.body.userId = decoded.userId;
            next();
        }
    });
}

module.exports = {
    hash,
    verifyToken,
    createUserToken,
    getUserIdFromToken,
    checkIfAuthenticatedAndGetUserId
}
