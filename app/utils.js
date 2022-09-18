const rateLimit = require('express-rate-limit');
const { DateTime } = require('luxon-business-days');

const now = DateTime.now();

const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: now.isBusinessDay() ? 100 : 200, // 100 per workday 200 on weekends
    legacyHeaders: false,
    standardHeaders: true,
});

module.exports = {
    rateLimiter,
};
