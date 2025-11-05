// Logic to reset password for a User

import User from "../../models/user.js"


export const resetPassword = async (req, res) => {
    try {
        // console.log(req.body)
        const { email, newPassword } = req.body
        if (!email) {
            // console.log()
            res.status(400).json({ message: "Missing email Field" })
        }
        if (!newPassword) {
            // console.log()
            res.status(400).json({ message: "Missing newPassword Field" })
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




        // check if resetcode is expired
        // if (user._resetCodeExpires < Date.now()) {
        //     // console.log("Reset code has expired")
        //     return res.status(400).json({ message: "Reset code has expired, Resquest a new code" })
        // }

        user.password = newPassword
        await user.save()


        return res.status(200).json({ message: "Password reset successfully" })

    } catch (err) {
        console.error("Error resesting User Password", err)
        return res.status(500).json({ error: "Server Error. Error, reseting user password." })
    }
}