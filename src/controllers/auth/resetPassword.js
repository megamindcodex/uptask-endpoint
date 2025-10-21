// Loigic to reset password for a User

import User from "../../models/user.js"


export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetCode } = req.body
        if (!email) {
            // console.log("")
            res.status(400).json({ message: "Missing email Field" })
        }
        if (!newPassword) {
            // console.log()
            res.status(400).json({ message: "Missing newPassword Field" })
        }
        if (!resetCode) {
            // console.log()
            res.status(400), json({ message: "Missing resetCode Field" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            // consol.log("User not found")
            return res.status(404).json({ messae: "User not found" })
        }

        if (user.password === newPassword) {
            // console.log("New password cannot be same as previous password")
            return res.status(400).json({ message: "New password cannot be same as previous password" })
        }


        if (user._resetPasswordCode !== resetCode) {
            // console.log("Incorrect Reset Code")
            return res.status(400).json({ message: "Incorrect Reset Code!" })
        }

        // check if resetcode is expired
        if (user._resetCodeExpires < Date.now()) {
            // console.log("Reset code has expired")
            return res.status(400).json({ message: "Reset code has expired, Resquest a new code" })
        }

        user.password = newPassword
        user._resetPasswordCode = null
        user._resetCodeExpires = null

        await user.save()


        res.status(200).json({ message: "Password reset successfully" })

    } catch (err) {
        console.error("Error resesting User Password", err)
        return res.status(500).json({ error: "Server Error. Error, reseting user password." })
    }
}