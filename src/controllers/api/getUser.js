// Logic to fetch/get user Data
import User from "../../models/user.js"

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId
        // console.log(userId)

        // const userName = req.query.userName
        // if (!userName) {
        //     return res.status(400).json({ error: "Missing userId parameter" })
        // }
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        // console.log("Fetched user data:", user)
        return res.status(200).json({ user, message: "user Found" })

    } catch (err) {
        console.error("Error fetching user data:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}