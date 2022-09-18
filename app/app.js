const rateLimit = require('express-rate-limit');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const { DateTime } = require('luxon-business-days');

const now = DateTime.now()

const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: now.isBusinessDay() ? 100 : 200, // 100 per workday 200 on weekends
    legacyHeaders: false,
    standardHeaders: true,
});

const { conversionsRouter } = require('./api/v1');

const {
    unprocessableEntityErrorHandler,
    unauthorizedErrorHandler,
    genericErrorHandler,
} = require('./middleware/errorHandler');

const basicAuth = require('./middleware/basicAuth');
// use an appropriate logger capable of logging to something like logzio
const logger = console;

const app = express();
const port = 3001;

app.use(rateLimiter);
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// end points
app.get('/health', (req, res) => {
    res.send('App running Ok!');
});

app.use(basicAuth);
app.use('/api/v1', conversionsRouter);

app.use(unauthorizedErrorHandler);
app.use(unprocessableEntityErrorHandler);
app.use(genericErrorHandler);

if (!module.parent) {
    app.listen(port, () => logger.log(`app listening on port ${port}!`));
} else {
    app.listen(process.env.PORT, () => logger.log(`app listening on port ${port}!`));
}

module.exports = app;
