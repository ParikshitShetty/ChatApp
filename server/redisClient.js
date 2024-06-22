const redis  = require('redis');

// Create Redis Client
const redisClient = redis.createClient({
    socket:{
        host: process.env.REDIS_HOST,
        port : process.env.REDIS_PORT,
    },
});

// Connecting redis
(async () => {
    await redisClient.connect();
    console.log("Triggerred connect");
})();

console.log("Triggerred");

redisClient.on('connect', () => {
    console.log("Connecting to Redis");
});

redisClient.on('ready', () => {
    console.log("Connected! & Ready");
});

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

redisClient.on('end', () => {
    console.log('Redis Client Disconnected', err);
});

process.on('SIGINT',() =>{
    redisClient.quit();
});

module.exports = redisClient;