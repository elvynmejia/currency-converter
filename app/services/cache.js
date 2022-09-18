const redis = require('redis');

let redisClient;

const connectToCache = async () => {
    redisClient = redis.createClient();

    redisClient.on('error', (error) => {
        throw new Error(`Error : ${error}`);
    });

    await redisClient.connect();
};

const getCacheFor = async (key) => redisClient.get(key);

const setCacheFor = async (key, payload) => redisClient.set(
    key,
    JSON.stringify(payload),
);

module.exports = {
    connectToCache,
    getCacheFor,
    setCacheFor,
};
