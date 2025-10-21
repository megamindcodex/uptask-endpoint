// Logic to login a user in the database 
import User from "../../models/user.js";
import { createAccessToken } from "../../middleware/jwtAuth.js";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Email and password are required for login");
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        // Check if password matches
        const isMatch = user.password === password; // In production, use hashed passwords and bcrypt.compare()
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const accessToken = createAccessToken(user._id);
        if (!accessToken) {
            console.log("Failed to create access token");
            return res.status(500).json({ message: "somthing went wrong!, try again" });
        }


        console.log(`✅ User ${user.email} just logged in:`);

        // res.setHeader("Authorization", accessToken); // for some reason this is not working, so i will send token in response body and come to fix this later
        res.status(200).json({ message: "Login successful", accessToken, user });

    } catch (err) {
        console.error("❌ Error logging in user:", err);
        res.status(500).json({ message: "Server error" });
    }
}
