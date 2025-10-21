// Responsible for connecting to MongoDB database
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("✅ Database connected successfully");

    } catch (err) {
        console.error("❌ Error connecting to the database:", err);
        process.exit(1); // Exit the process with failure
    }
};


export default connectDB;