import { Worker } from "bullmq";
import { redisConnection } from "../redis/connectionConfig.js";
import { send_email } from "../controllers/Emails/testEmail.js";


new Worker("email-queue", async (job) => {
    console.log(`Processing job: ${job.name} >>>`, job.data)

    if (job.name === "send-login-email") {
        await send_email(job.data)
    }
}, { connection: redisConnection })