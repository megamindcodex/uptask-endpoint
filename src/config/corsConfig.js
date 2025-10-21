import cors from "cors";

export const corsConfig = () => {
    const allowedOrigins = ["http://localhost:3000"];

    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (!allowedOrigins.includes(origin)) {
                const msg =
                    "The CORS policy for this site does not allow access from this specific Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // ✅ correct property
        optionsSuccessStatus: 200, // optional
    };

    // ✅ Return the configured middleware
    return cors(corsOptions);
};
