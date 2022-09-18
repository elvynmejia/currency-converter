const axios = require('axios');

const exchangeRates = axios.create({
    baseURL: 'https://api.coinbase.com/v2',
});

const getExchangeRates = async (to) => {
    try {
        // passing to or from to the API seems to have no effect
        const { data } = await exchangeRates.get(`/exchange-rates?currency=${to}`);
        return data.data.rates;
    } catch (e) {
      // TODO: throw custom error and handle it in the error handler middleware
        throw new Error('Unable to convert currency at this time.');
    }
};

module.exports = getExchangeRates;
