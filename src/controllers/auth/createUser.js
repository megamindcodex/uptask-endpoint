// Logic to create a new user in the database 
import User from "../../models/user.js";
import { createAccessToken } from "../../middleware/jwtAuth.js"



export const createUser = async (req, res) => {

    try {
        console.log(req.body);
        const { userName, email, password } = req.body;
        // Check if user email already exists
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "This Email is in use" });
        }

        const userNameExist = await User.findOne({ userName });
        if (userNameExist) {
            return res.status(400).json({ message: "This User Name is in use" });
        }


        const newUserObject = {
            userName: userName,
            email: email,
            password: password,
            taskCollections: [],
            _resetPasswordCode: "0000",
            _resetCodeExpires: "0000",
        }

        // Create a new user
        const newUser = await User.create(newUserObject)

        if (!newUser) {
            return res.status(500).json({ message: "Something went wrong" });
        }


        // Generate access token
        const accessToken = createAccessToken({ userId: newUser._id })
        if (!accessToken) {
            console.log("Failed to create access token")
            return res.status(500).json({ message: "somthing went wrong!, try again" })
        }


        // console.log(newUser)
        console.log("✅ New user created:");
        await newUser.save();


        // res.setHeader("Authorization", accessToken);  // for some reason this is not working, so i will send token in response body and come to fix this later
        res.status(201).json({ message: "account Resgistered successfully", accessToken, newUser });

    } catch (err) {
        console.error("❌ Error creating user:", err);
        res.status(500).json({ message: "Server error" });
    }
}
