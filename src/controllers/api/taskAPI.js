// Logic to Add new tast element, edit existing task element, delete task element

import User from "../../models/user.js"
import mongoose from "mongoose"
import { checkTaskCompletion } from "../../utils/checkTaskCompletion.js"


// Add a new task to a specific collection
export const addTask = async (req, res) => {
    try {
        // console.log(req.body)
        const { content, note, collectionId } = req.body
        // console.log(`content: ${content}, note: ${note}, collectionId: ${collectionId}`)


        if (!content) {
            return res.status(400).json({ message: "Missing taskContent parameter" })
        }
        if (note === undefined) {
            return res.status(400).json({ message: "Missing note parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }


        const userId = req.userId

        // Find user and collection 
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found" })
        }
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            console.log("collection not found")
            return res.status(404).json({ message: "Collection not found" })
        }
        // add new task to the collection
        const newTask = {
            content: content,
            checked: false,
            note: note,
            // id: new mongoose.Types.ObjectId().toString(), // generate a unique id for the task and convert it to string
        }

        collection.tasks.push(newTask)
        await user.save()

        return res.status(201).json({ message: `New task added to collection ${collectionId}` })
    } catch (err) {
        console.error("Error adding new task:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}






// Get All task in a specific collection 
export const getAllTasksInCollection = async (req, res,) => {
    try {
        // console.log(`CollectionId: ${req.query.collectionId}`)
        const collectionId = req.query.collectionId

        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }


        const userId = req.userId


        // Find user and collection
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }


        const taskCollections = user.taskCollections || []
        const collection = taskCollections.find(col => col.id === collectionId)
        if (!collection) {
            return res.status(404).json({ message: "Collection not Found" })
        }

        console.log(`All tasks in collection ${collectionId}:`, collection.tasks)
        return res.status(200).json({ tasks: collection.tasks, message: `All task in collection ${collectionId} Fetched` })

    } catch (err) {
        console.error("Error getting all tasks in collection:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}






// Edit an existing task in a specific collection
export const editTask = async (req, res) => {
    try {

        const { newContent, newNote } = req.body
        const collectionId = req.query.collectionId
        const taskId = req.query.taskId

        // console.log(collectionId: ${collectionId}, taskId: ${taskId}, newContent: ${newContent}`)

        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }
        if (!taskId) {
            return res.status(400).json({ message: "Missing taskId parameter" })
        }
        if (!newContent) {
            return res.status(400).json({ message: "Missing newContent parameter" })
        }

        const userId = req.userId

        // Find user and collection
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            return res.status(404).json({ error: "Collection not found" })
        }

        // Find the task element within the collection
        const tasks = collection.tasks || []
        const task = tasks.find(t => t.id === taskId) // find task by id with the array find method using the id provided in the request body
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }


        // Update task content
        task.content = newContent
        task.note = newNote
        await user.save()
        return res.status(200).json({ message: "Task updated", task })

    } catch (err) {
        console.error("Error editing task:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}






// Delete a task from a specific collection
export const deleteTask = async (req, res) => {
    try {
        const { taskId, collectionId } = req.query

        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }
        if (!taskId) {
            return res.status(400).json({ message: "Missing taskId parameter" })
        }

        const userId = req.userId

        // Find user and collection
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" })
        }
        // Find the task element within the collection
        const tasks = collection.tasks || []
        const taskIndex = tasks.findIndex(t => t.id === taskId) // find task index by id with the array findIndex method using the id provided in the request body
        if (taskIndex === -1) {
            return res.status(404).json({ message: "Task not found" })
        }

        // Remove task from the collection
        tasks.splice(taskIndex, 1)
        await user.save()
        return res.status(200).json({ message: "Task deleted" })


    } catch (err) {
        console.error("Error deleting task:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}






// Toggle task completion status
export const toggleTaskTick = async (req, res) => {
    try {
        const { collectionId, taskId } = req.query

        if (!collectionId) {
            return res.status(400).json({ message: "Missing collectionId parameter" })
        }
        if (!taskId) {
            return res.status(400).json({ message: "Missing taskId parameter" })
        }

        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User Not Found" })

        const collection = user.taskCollections.find(col => col.id === collectionId)
        if (!collection) return res.status(404).json({ message: "Collection Not Found" })

        const task = collection.tasks.find(t => t.id === taskId)
        if (!task) return res.status(404).json({ message: "Task Not Found" })

        // THE FIX
        task.tick = !task.tick

        await user.save()

        return res.status(200).json({ message: `task property toggled to ${task.tick}` })
    } catch (err) {
        console.error("Error toggling task completion:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}






// change Index/Position of Individual task element // //not usable for now
// export const changeTaskIndex = async (req, res) => {
//     try {
//         const { userName, collectionId, taskId, newIndex } = req.body
//         if (!userName) {
//             return res.status(400).json({ error: "Missing userName parameter" })
//         }

//         if (!collectionId) {
//             return res.status(400).json({ error: "Missing collectionId parameter" })
//         }

//         if (!taskId) {
//             return res.status(400).json({ error: "Missing taskId parameter" })
//         }
//         if (newIndex === undefined || newIndex === null) {
//             return res.status(400).json({ error: "Missing newIndex parameter" })
//         }

//         if (isNaN(newIndex) || newIndex < 0) {
//             return res.status(400).json({ error: "Invalid newIndex parameter" })
//         }

//         // Find user and collection
//         const user = await User.findOne({ userName: userName })
//         if (!user) {
//             return res.status(404).json({ error: "User not found" })
//         }


//         const taskColllections = user.taskCollection || []
//         const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
//         if (!collection) {
//             return res.status(404).json({ error: "Collection not found" })
//         }

//         // Find the task element within the collection
//         const tasks = collection.tasks || []
//         const taskIndex = tasks.findIndex(t => t.id === taskId) // find task index by id with the array findIndex method using the id provided in the request body
//         if (taskIndex === -1) {
//             return res.status(404).json({ error: "Task not found" })
//         }
//         if (newIndex >= tasks.length) {
//             return res.status(400).json({ error: "newIndex is out of bounds" })
//         }
//         // Remove the task from its current position
//         const [task] = tasks.splice(taskIndex, 1)   // splice returns an array of removed elements, so we destructure it to get the task object
//         // Insert the task at the new position
//         tasks.splice(newIndex, 0, task) // insert the task at the new index
//         await user.save()
//         return res.status(200).json({ message: `Task moved to index ${newIndex}`, task })

//     } catch (err) {
//         console.error("Error changing task index:", err)
//         res.status(500).json({ error: "Internal server error" })
//     }
// }