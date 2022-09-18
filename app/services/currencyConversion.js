const {
    connectToCache,
    getCacheFor,
    setCacheFor,
} = require('./cache');

const getExchangeRates = require('./exchangeRates');

const EXCHANGES_RATES_CACHE = 'EXCHANGES_RATES_CACHE';

const convert = async ({ from, to, ...payload }) => {
    let rates;

    // TODO: connect at application start up time
    await connectToCache();

    const cached = await getCacheFor(EXCHANGES_RATES_CACHE);

    if (cached) {
        rates = cached;
    } else {
        const tempRates = await getExchangeRates(to);
        // cache the data
        await setCacheFor(
            EXCHANGES_RATES_CACHE,
            tempRates,
        );
        rates = tempRates;
    }

    const amount = parseFloat(payload.amount);
    const toRate = parseFloat(rates[to]);
    const fromRate = parseFloat(rates[from]);
    const exchangeRate = toRate / fromRate;

    const newAmout = amount * exchangeRate;

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

module.exports = convert;
