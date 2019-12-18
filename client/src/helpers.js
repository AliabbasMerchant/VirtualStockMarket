import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';

function hash(text) {
    return crypto.createHash('sha256').update(text).digest('base64');
}

function decodeToken(token) {
    // token should not be null
    return jsonwebtoken.decode(token);
}

function getUserIdFromToken(token) {
    return jsonwebtoken.decode(token).userId;
}

export default {
    hash,
    decodeToken,
    getUserIdFromToken
};
