const uuid = require('uuid');
const rateLimit = require('express-rate-limit');
const { DateTime } = require('luxon-business-days');

const now = DateTime.now();

const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: now.isBusinessDay() ? 100 : 200, // 100 per workday 200 on weekends
    legacyHeaders: false,
    standardHeaders: true,
});

const tracking = (req, res, next) => {
    req.uuid = uuid.v4();
    res.setHeader('X-Request-Id', req.uuid);

    req.startedAt = Date.now();
    next();
};

const requestResponseLogger = (req, res, next) => {
    const defaultWrite = res.write;
    const defaultEnd = res.end;

    const chunks = [];

    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));
        return defaultWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }

        res.body = Buffer.concat(chunks).toString('utf8');
        defaultEnd.apply(res, arguments);
    };

    res.on('finish', () => {
        const requestHeaders = Object.fromEntries(
            [
                'Accept',
                'Content-Length',
                'Content-Type',
                'Host',
                'User-Agent',
            ].map((name) => [name, req.headers[name.toLowerCase()]]),
        );

        const loggableRequest = {
            userName: req?.user?.name,
            userId: req?.user?.userId,
            ip: req.ip,
            uuid: req.uuid,
            method: req.method,
            url: req.originalUrl,
            body: JSON.stringify(req.body),
            headers: requestHeaders,
            startedAt: req.startedAt,
            duration: Date.now() - req.startedAt,
        };

        const loggableResponse = {
            body: res.body,
            status: res.statusCode,
            headers: {
                'X-Request-Id': res.getHeader('X-Request-Id'),
                'Content-Type': res.getHeader('Content-Type'),
                'Content-Length': res.getHeader('Content-Length'),
            },
        };

        const logData = {
            request: loggableRequest,
            response: loggableResponse,
        };
        // here you can easily log this data to something like logzio
        // console.log(logData);
    });

    next();
};

module.exports = {
    rateLimiter,
    requestResponseLogger,
    tracking
};
