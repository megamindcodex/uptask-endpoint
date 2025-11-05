// Logic to verify reset code for User

import User from "../../models/user.js"



export const verify_resetCode = async (req, res) => {
    try {
        const { email, resetCode } = req.body
        if (!email) {
            console.log("Missing email field in request body")
            return res.status(400).json({ message: "Missing email field in request body" })
        }
        if (!resetCode || resetCode === "") {
            console.log("Missing resetCode field in request body")
            return res.status(400)({ message: "Missing resetCode field in request body" })
        }


        const user = await User.findOne({ email })
        if (!user) {
            console.log("No user with this email found")
            return res.status(404).json({ message: "No user with this email found" })
        }


        // console.log(user._resetPasswordCode !== resetCode)
        // console.log(user._resetPasswordCode)
        // console.log(`user-resetCode: ${user._resetPasswordCode}, data-type: ${typeof (user._resetPasswordCode)}`)
        // console.log(`resetCode: ${resetCode}, data-type: ${typeof (resetCode)}`)
        if (user._resetPasswordCode !== resetCode) {
            console.log("Invalid reset code")
            return res.status(400).json({ message: "Invalid reset code" })
        }


        user._resetPasswordCode = "0000"
        await user.save()
        return res.status(200).json({ message: "reset code verified and valid" })

    } catch (err) {
        return res.status(500).json({ message: "Server error. somthing went wrong." })
    }
}