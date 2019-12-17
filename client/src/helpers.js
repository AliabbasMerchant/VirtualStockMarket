const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function hash(text) {
    return crypto.createHash('sha256').update(text).digest('base64');
}

function decodeToken(token) {
    // token should not be null
    return jwt.decode(token);
}

function getUserIdFromToken(token) {
    return jwt.decode(token).userId;
}

module.exports = {
    hash,
    decodeToken,
    getUserIdFromToken
}
