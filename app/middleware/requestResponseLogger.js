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

    res.on('finish', async () => {
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
            params: req.params,
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

        // here you can easily log this data to something like logzio or mongo
        // console.log(logData);
    });

    next();
};

module.exports = requestResponseLogger;
