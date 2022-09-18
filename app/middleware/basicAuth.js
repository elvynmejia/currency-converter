const auth = require('basic-auth');
const { timingSafeEqual } = require('crypto');
const createError = require('http-errors');

const Users = require('../services/users');

const safeCompare = (userInput, secret) => {
    const userInputLength = Buffer.byteLength(userInput);
    const secretLength = Buffer.byteLength(secret);

    const userInputBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
    userInputBuffer.write(userInput);
    const secretBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
    secretBuffer.write(secret);

    return !!(timingSafeEqual(userInputBuffer, secretBuffer) & userInputLength === secretLength);
};

const basicAuth = async (req, _res, next) => {
    const authentication = auth(req);
    if (!authentication) {
        return next(createError.Unauthorized());
    }

    const user = Users.authenticate(authentication);

    if (user && safeCompare(authentication.pass, user.apiKey)) {
        req.user = user;
    } else {
        return next(createError.Unauthorized());
    }

    return next();
};

module.exports = basicAuth;
