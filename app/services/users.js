const user = require('../constants');

const authenticate = (creds) => {
    // TODO: should look up user in database instead of using constants
    if (user.apiId === creds.name && user.apiKey === creds.pass) {
        return user;
    }
    return null;
};

module.exports = {
    authenticate,
};
