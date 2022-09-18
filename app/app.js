const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const { conversionsRouter } = require('./api/v1');
const {
    unprocessableEntityErrorHandler,
    genericErrorHandler,
} = require('./middleware/errorHandler');

// use an appropriate logger capable of logging to something like logzio
const logger = console;

const app = express();
const port = 3001;

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// end points
app.get('/health', (req, res) => {
    res.send('App running Ok!');
});

app.use('/api/v1', conversionsRouter);

app.use(unprocessableEntityErrorHandler);
app.use(genericErrorHandler);

if (!module.parent) {
    app.listen(port, () => logger.log(`app listening on port ${port}!`));
} else {
    app.listen(process.env.PORT, () => logger.log(`app listening on port ${port}!`));
}

module.exports = app;
