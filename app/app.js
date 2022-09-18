const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const {
    rateLimiter,
} = require('./utils');

const { conversionsRouter } = require('./api/v1');

const {
    unprocessableEntityErrorHandler,
    unauthorizedErrorHandler,
    genericErrorHandler,
} = require('./middleware/errorHandler');

const basicAuth = require('./middleware/basicAuth');
const tracking = require('./middleware/tracking');
const requestResponseLogger = require('./middleware/requestResponseLogger');

// TODO: use an appropriate logger capable of logging to something like logzio
const logger = console;

const app = express();
const port = 5000;

app.use(tracking);
app.use(rateLimiter);
app.use(requestResponseLogger);
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// end points definition
app.get('/health', (req, res) => {
    res.send('App running Ok!');
});

app.use(basicAuth);
app.use('/api/v1', conversionsRouter);

app.use(unauthorizedErrorHandler);
app.use(unprocessableEntityErrorHandler);
app.use(genericErrorHandler);

app.listen(port, () => logger.log(`app listening on port ${port}!`));

module.exports = app;
