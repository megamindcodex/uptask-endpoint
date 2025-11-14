// Logic for creating a new task collection for a user
import User from "../../models/user.js"

export const createNewCollection = async (req, res) => {
    try {
        const { title, description } = req.body

        if (!title) {
            return res.status(400).json({ message: "Missing collection title parameter" })
        }

        if (!description) {
            return res.status(400).json({ message: "Missing collection description parameter" })
        }

        const userId = req.userId

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const newCollection = {
            title: title,
            description: description || "",
            tasks: [],
        }

        user.taskCollections.push(newCollection)
        await user.save()

        return res.status(201).json({ message: "New collection created", newCollection })

    } catch (err) {
        console.error("Error creating new collection:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}



// Get all task collections for a user
export const get_all_colletions = async (req, res) => {
    try {
        // const userName = req.query.userName

        // if (!userName) {
        //     return res.status(400).json({ message: "Missing userName parameter" })
        // }

        const userId = req.userId

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const taskCollections = user.taskCollections || []

        return res.status(200).json({ message: "Successfully fetched all task collections", taskCollections })


    } catch (err) {
        console.error("Error fetching collections:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}




// Logic for editing a task collection name
export const editCollection = async (req, res) => {
    try {
        const { newTitle, newDescription } = req.body

        console.log(req.query)
        const { collectionId } = req.query

        if (!newTitle) {
            return res.status(400).json({ message: "Missing newTitle parameter for collection" })
        }

        if (!newDescription) {
            return res.status(400).json({ message: "Missing newDescription parameter for collection" })
        }

        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }

        const userId = req.userId


        // Find user and collection
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        console.log("collectionId:", collectionId)
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" })
        }
        // Update collection
        collection.title = newTitle
        collection.description = newDescription
        await user.save()
        // Return success response
        return res.status(200).json({ message: "Collection updated", collection })
    } catch (err) {
        console.error("Error changing collection name:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}




// Logic for deleting a task collection
export const deleteCollection = async (req, res) => {
    try {
        const { collectionId } = req.query
        console.log(`Received request to delete collection with id: ${collectionId}`)

        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }

        const userId = req.userId

        // Find user and collection
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        console.log(`User found: ${user.userName}`)

        // get collections from user
        const taskCollections = user.taskCollections || []

        // Find collection index

        const collectionIndex = taskCollections.findIndex(col => col.id === collectionId) // find collection index by id with the array findIndex method using the id provided in the request body
        if (collectionIndex === -1) {
            return res.status(404).json({ message: "Collection not found" })
        }



        console.log(`Deleting collection with id: ${collectionId}`)

        // Remove collection
        taskCollections.splice(collectionIndex, 1) // remove the collection from the array using splice
        user.taskCollections = taskCollections // update the user's taskCollection
        await user.save()

        return res.status(200).json({ message: "Collection deleted Successfully" })

    } catch (err) {
        console.error("Error deleting collection:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}