const axios = require('axios');

const exchangeRates = axios.create({
    baseURL: 'https://api.coinbase.com/v2',
});

const convert = async ({ from, to, ...payload }) => {
    let rates;

    try {
        // passing to or from to the API seems to have no effect
        const { data } = await exchangeRates.get(`/exchange-rates?currency=${to}`);
        rates = data.data.rates;
    } catch (e) {
        throw new Error('Unable to convert currency at this time.');
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
