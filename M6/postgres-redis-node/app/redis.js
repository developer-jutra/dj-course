const fs = require('fs');
const redis = require('redis');

// Read Redis password and build the connection URL
const redisPassword = fs.readFileSync(process.env.REDIS_PASSWORD_FILE, 'utf8').trim();
const redisUrl = `redis://:${redisPassword}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

// Create and connect Redis client
const redisClient = redis.createClient({
  url: redisUrl
});

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})().catch(err => console.error('Redis connection error:', err));

module.exports = redisClient;
