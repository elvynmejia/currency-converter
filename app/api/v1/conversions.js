const Joi = require('joi');
const { Router } = require('express');

const router = Router();

const convertCurrency = require('../../services/currencyConversion');

// decorate response as needed
const present = (data) => {
    const {
        from,
        to,
        amount,
        exchangeRate,
        newAmout,
        toRate,
        fromRate,
    } = data;

    return {
        from,
        to,
        amount,
        exchangeRate,
        newAmout,
        toRate,
        fromRate,
    };
};

const schema = Joi.object({
    to: Joi.string().required(),
    from: Joi.string().required(),
    amount: Joi.string().required(),
});

router.post('/conversions', async (req, res, next) => {
    let result;

    const {
        error,
        value: validatedData,
    } = schema.validate({
        to: req.body.to,
        from: req.body.from,
        amount: req.body.amount,
    });

    if (error) {
        return next(error);
    }

    const { to, from, amount } = validatedData;

    try {
        result = await convertCurrency({
            to,
            from,
            amount,
        });
    } catch (e) {
        /*
        should catch specific instances of an error class so that this is not a catch all errors
        situation
        */
        return next(e);
    }

    return res.send(present(result));
});

module.exports = router;
