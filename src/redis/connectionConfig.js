import IORedis from "ioredis"


export const redisConnection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null // ✅ Required by BullMQ
})


// Listen for successful connection
redisConnection.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

// Listen for ready (fully ready to use)
redisConnection.on('ready', () => {
    console.log('✅ Redis is ready to accept commands');
});

// Listen for errors
redisConnection.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});