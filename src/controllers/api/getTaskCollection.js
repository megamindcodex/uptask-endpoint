// Logic to get user's task collection

import User from "../../models/user.js"

export const getTaskCollection = async (req, res) => {
    try {
        const userId = req.query.userId
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" })
        }
        const user = await User.findOne({ userId })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const taskCollections = user.taskCollections || []
        return res.status(200).json({ taskCollections })

    } catch (err) {
        console.error("Error fetching task collection:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}