import { Queue } from "bullmq";
import { redisConnection } from "../redis/connectionConfig.js";



const emailQueue = new Queue("email-queue", { connection: redisConnection })


export const addEmailJob = async (name, data) => {
    emailQueue.add(name, data, { delay: 10000 })
}


