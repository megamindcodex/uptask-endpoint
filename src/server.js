// server entry point

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { corsConfig } from './config/corsConfig.js';





const app = express();
const PORT = process.env.PORT || 5000;



const environment = process.env.NODE_ENV || 'development'; // 'production' or 'development'
const envFile = environment === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// use CORS configuration
app.use(corsConfig())






// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Start Server Function
const startServer = async () => {
    {
        try {
            // Connect to Database
            await connectDB();
            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}, http://localhost:${PORT}`);
            })
        } catch (err) {
            console.error("❌ Error starting server:", err);
        }
    }
};

// Routes 
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// start the server
startServer();