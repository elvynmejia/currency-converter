const uuid = require('uuid');

const tracking = (req, res, next) => {
    req.uuid = uuid.v4();
    res.setHeader('X-Request-Id', req.uuid);

    req.startedAt = Date.now();
    next();
};

module.exports = tracking;
