const user = require('../constants');

const authenticate = (creds) => {
    // should look up user in database instead of using constants
    if (user.apiId === creds.name && user.apiKey === creds.pass) {
        return user;
    }
};

module.exports = {
    authenticate,
};
