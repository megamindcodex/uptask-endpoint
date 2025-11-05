// Logic for creating a new task collection for a user
import User from "../../models/user.js"

export const createNewCollection = async (req, res) => {
    try {
        const { userName, collectionName, description } = req.body
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionName) {
            return res.status(400).json({ error: "Missing collectionName parameter" })
        }

        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const newCollection = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // simple unique id generation 
            name: collectionName,
            description: description || "",
            tasks: [],
        }

        user.taskCollections.push(newCollection)
        await user.save()

        return res.status(201).json({ message: "New collection created", collection: newCollection })

    } catch (err) {
        console.error("Error creating new collection:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}



// Get all task collections for a user
export const get_all_colletions = async (req, res) => {
    try {
        const userName = req.query.userName

        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }

        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const taskCollections = user.taskCollections || []

        return res.status(200).json({ collections: taskCollections })


    } catch (err) {
        console.error("Error fetching collections:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}




// Logic for editing a task collection name
export const editCollection = async (req, res) => {
    try {
        const { userName, collectionId, newName, newDescription } = req.body
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameter" })
        }
        if (!newName) {
            return res.status(400).json({ error: "Missing newName parameter for collection" })
        }

        if (!newDescription) {
            return res.status(400).json({ error: "Missing newDescription parameter for collection" })
        }


        // Find user and collection
        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        // console.log(`collectionId: ${collectionId}`)
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            return res.status(404).json({ error: "Collection not found" })
        }
        // Update collection
        collection.name = newName
        collection.description = newDescription
        await user.save()
        // Return success response
        return res.status(200).json({ message: "Collection name updated", collection })
    } catch (err) {
        console.error("Error changing collection name:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}




// Logic for deleting a task collection
export const deleteCollection = async (req, res) => {
    try {
        const { userName, collectionId } = req.query
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameter" })
        }

        // Find user and collection
        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // get collections from user
        const taskColllections = user.taskCollections || []

        // Find collection index
        const collectionIndex = taskColllections.findIndex(col => col.id === collectionId) // find collection index by id with the array findIndex method using the id provided in the request body
        if (collectionIndex === -1) {
            return res.status(404).json({ error: "Collection not found" })
        }

        console.log(`Deleting collection with id: ${collectionId} at index: ${collectionIndex}`)

        // Remove collection
        taskColllections.splice(collectionIndex, 1) // remove the collection from the array using splice
        user.taskCollections = taskColllections // update the user's taskCollection
        await user.save()

        return res.status(200).json({ message: "Collection deleted Successfully" })

    } catch (err) {
        console.error("Error deleting collection:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}