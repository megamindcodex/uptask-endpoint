import User from "../../models/user.js"



export const getAllUsers = async () => {
    try {

        const users = await User.find()

        console.log(users)
        return res.status(200).json(users)

    } catch (err) {
        console.error("Error Getting all user Data", err)
        return res.status(500).json({ Message: "internel server Error" })
    }
}