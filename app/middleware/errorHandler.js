const { ValidationError } = require('joi');
const createError = require('http-errors');

const unprocessableEntityErrorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(422).json({
            errors: err.details.map(({ message }) => ({
                message,
            })),
            message: 'Unprocessable Entity',
        });
    }

    return next(err);
};

const unauthorizedErrorHandler = (err, req, res, next) => {
    if (err instanceof createError.Unauthorized) {
        return res.status(401).json({
            errors: [],
            message: 'Unauthorized',
        });
    }

    return next(err);
};
const genericErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        errors: [],
        message: 'Internal Server Error',
    });

    return next();
};

module.exports = {
    unprocessableEntityErrorHandler,
    unauthorizedErrorHandler,
    genericErrorHandler,
};
