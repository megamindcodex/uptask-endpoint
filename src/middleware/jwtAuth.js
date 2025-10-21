// Logic for checking JWT token authentication


import jwt from "jsonwebtoken"
const { sign, verify } = jwt



export const createAccessToken = (userId) => {
    const jwt_secret = process.env.JWT_SECRET
    try {

        if (!userId) {
            console.log("No userId provided for token creation");
            return res.status(400).json({ message: "Missing userId parameter" });
        }

        console.log(jwt_secret)
        const token = sign({ userId }, jwt_secret, { expiresIn: 1000 * 60 * 60 * 24 }) // 24 hours

        if (!token) {
            throw new Error("Token generation failed");
        }


        return token

    } catch (err) {
        console.error("Error creating access token:", err);
        return null
    }
}




// Middleware Logic to verify JWT token
export const verifyAccessToken = (req, res, next) => {
    try {
        const jwt_secret = process.env.JWT_SECRET
        const authHeader = req.headers["authorization"];
        // console.log(`authHeader: ${authHeader}`)
        if (!authHeader) {
            return res.status(401).json({ message: "not authorized, missing authorization header" });
        }

        const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: "not authorized, missing access token" });
        }


        verify(token, jwt_secret, (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(401).json({ message: "invalid or expired access token" });
            }

            req.userId = decoded.userId;
            next();
        })
    } catch (err) {
        console.error("Error verifying access token:", err);
        return res.status(500).json({ message: "Server error" });
    }
}