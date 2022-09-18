const redis = require('redis');

let redisClient;

const connectToCache = async () => {
    redisClient = redis.createClient();

    // TODO: throw a custom error and catch it in the error handling middleware
    redisClient.on('error', (error) => {
        throw new Error(`Error : ${error}`);
    });

    await redisClient.connect();
};

// TODO: add proper error handling
const getCacheFor = async (key) => {
  const result = await redisClient.get(key);
  return JSON.parse(result);
};

// TODO: add proper error handling
const setCacheFor = async (key, payload) => redisClient.set(
    key,
    JSON.stringify(payload),
);

module.exports = {
    connectToCache,
    getCacheFor,
    setCacheFor,
};
