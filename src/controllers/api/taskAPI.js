// Logic to Add new tast element, edit existing task element, delete task element

import User from "../../models/user.js"
import mongoose from "mongoose"
import { checkTaskCompletion } from "../../utils/checkTaskCompletion.js"


// Add a new task to a specific collection
export const addTask = async (req, res) => {
    try {
        const { userName, collectionId, content } = req.body
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameter" })
        }
        if (!content) {
            return res.status(400).json({ error: "Missing taskContent parameter" })
        }

        // Find user and collection 
        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            return res.status(404).json({ error: "Collection not found" })
        }
        // add new task to the collection
        const newTask = {
            content: content,
            checked: false,
            id: new mongoose.Types.ObjectId().toString(), // generate a unique id for the task and convert it to string
        }

        collection.tasks.push(newTask)
        await user.save()

        return res.status(201).json({ message: `New task added to collection ${collectionId}`, task: newTask })
    } catch (err) {
        console.error("Error adding new task:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}






// Get All task in a specific collection 
export const getAllTasksInCollection = async (req, res,) => {
    try {
        const userName = req.query.userName
        const collectionId = req.query.collectionId
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameter" })
        }

        // Find user and collection
        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not Found" })
        }

        const taskCollections = user.taskCollections || []
        const collection = taskCollections.find(col => col.id === collectionId)
        if (!collection) {
            return res.status(404).json({ error: "Collection not Found" })
        }

        console.log(`All tasks in collection ${collectionId}:`, collection.tasks)
        return res.status(200).json({ tasks: collection.tasks })

    } catch (err) {
        console.error("Error getting all tasks in collection:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}






// Edit an existing task in a specific collection
export const editTask = async (req, res) => {
    try {

        const { userName, collectionId, taskId, newContent } = req.body

        // console.log(`userName: ${userName}, collectionId: ${collectionId}, taskId: ${taskId}, newContent: ${newContent}`)
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameter" })
        }
        if (!taskId) {
            return res.status(400).json({ error: "Missing taskId parameter" })
        }
        if (!newContent) {
            return res.status(400).json({ error: "Missing newContent parameter" })
        }

        // Find user and collection
        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
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
            return res.status(404).json({ error: "Task not found" })
        }


        // Update task content
        task.content = newContent
        await user.save()
        return res.status(200).json({ message: "Task updated", task })

    } catch (err) {
        console.error("Error editing task:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}






// Delete a task from a specific collection
export const deleteTask = async (req, res) => {
    try {
        const { userName, collectionId, taskId } = req.query
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameter" })
        }
        if (!taskId) {
            return res.status(400).json({ error: "Missing taskId parameter" })
        }

        // Find user and collection
        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const taskColllections = user.taskCollections || []
        const collection = taskColllections.find(col => col.id === collectionId) // find collection by id with the array find method using the id provided in the request body
        if (!collection) {
            return res.status(404).json({ error: "Collection not found" })
        }
        // Find the task element within the collection
        const tasks = collection.tasks || []
        const taskIndex = tasks.findIndex(t => t.id === taskId) // find task index by id with the array findIndex method using the id provided in the request body
        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found" })
        }

        // Remove task from the collection
        tasks.splice(taskIndex, 1)
        await user.save()
        return res.status(200).json({ message: "Task deleted" })


    } catch (err) {
        console.error("Error deleting task:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}






// Toggle task completion status
export const toggleTaskCompletion = async (req, res) => {
    try {
        const { userName, collectionId, taskId, checked } = req.body
        if (!userName) {
            return res.status(400).json({ error: "Missing userName parameter" })
        }
        if (!collectionId) {
            return res.status(400).json({ error: "Missing collectionId parameters" })
        }
        if (!taskId) {
            return res.status(400).json({ error: "Missing taskId parameters" })
        }
        if (!checked) {
            return res.status(400).json({ error: "Missing checked parameters" })
        }

        const user = await User.findOne({ userName: userName })
        if (!user) {
            return res.status(404).json({ error: "User Not Found" })
        }

        const taskCollection = user.taskCollections || []
        const collection = taskCollection.find(col => col.id === collectionId)
        if (!collection) {
            return res.status(404).json({ error: "Collection Not Found" })
        }

        const tasks = collection.tasks || []
        const task = tasks.find(t => t.id === taskId)
        if (!task) {
            return res.status(404).json({ error: "Fask Not Found" })
        }

        task.checked = checked

        // console.log(collection.tasks)

        const all_task_checked_Array = collection.tasks.map(c => ({ checked: c.checked })) //This works because: map() loops through each object,You return a new object each time, containing just the property you want.

        console.log(all_task_checked_Array)

        const taskCompleted = await checkTaskCompletion(all_task_checked_Array)

        // console.log(`data type of taskCompleted is ${typeof (taskCompleted)}`)


        collection.all_task_completed = taskCompleted

        await user.save()

        // console.log(task.checked)
        return res.status(200).json({ message: `task element toggled to ${task.checked} ` })
    } catch (err) {
        console.error("Error toggling task completion:", err)
        res.status(500).json({ error: "Internal server error" })
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