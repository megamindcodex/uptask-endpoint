// Logic to send reset code to user Email inbox

import crypto from "crypto"
import User from "../../models/user.js"

export const request_password_reset_code = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        if (!email) {
            return res.status(400).json({ errorMsg: "Missing email field in request body" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            console.log("No user found with the provided email:", email);
            return res.status(404).json({ message: "No user found with the provided email" });
        }

        const resetCode = await generate_reset_code();
        // Here you would typically save the reset code to the database associated with the user

        // Send the reset code to user's email
        // await send_email(email, resetCode);


        user._resetPasswordCode = resetCode;
        user._resetCodeExpires = Date.now() + 60 * 1000
        await user.save();

        res.status(200).json({ message: "Password reset code sent to email successfully" });
    } catch (err) {
        console.error("❌ Error requesting password reset code:", err);
        return res.status(500).json({ message: "Server error. something went wrong." });
    }
}

// Function to Generate reset code
const generate_reset_code = async () => {
    // Generate a random 6-digit code 
    const code = crypto.randomInt(100000, 999999).toString();
    // console.log(code);
    return code;
}

// ProtoType function to send Email to user Email inbox
const send_email = async (email, resetCode) => {
    // Logic to send email
}