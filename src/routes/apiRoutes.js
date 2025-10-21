// Routes to handle API requests related to users and tasks
import express from "express";
import { verifyAccessToken } from "../middleware/jwtAuth.js";
import { getUserData } from "../controllers/api/getUser.js";
import { getTaskCollection } from "../controllers/api/getTaskCollection.js";
import {
    createNewCollection,
    get_all_colletions,
    editCollection,
    deleteCollection,
} from "../controllers/api/collectionAPIs.js";
import {
    addTask,
    editTask,
    deleteTask,
    toggleTaskCompletion,
    getAllTasksInCollection,
} from "../controllers/api/taskAPI.js";


const router = express.Router();

// Route to fetch user data
router.get("/get-user-data", verifyAccessToken, getUserData);


// Route to fetch all task collections for a user
router.get("/get-all-collections", verifyAccessToken, get_all_colletions);

// Route to fetch user's task collection
router.get("/get-task-collection", verifyAccessToken, getTaskCollection);

// Route to create a new task collection for a user
router.post("/create-new-collection", verifyAccessToken, createNewCollection);

// Route to edit a task collection's name and description
router.put("/edit-collection", verifyAccessToken, editCollection);


// Route to delete a task collection
router.delete("/delete-collection", verifyAccessToken, deleteCollection);




// Route to add a new task to a collection
router.post("/add-task", verifyAccessToken, addTask);

// Route to get all tasks in a specific collection
router.get("/get-all-tasks-in-collection", verifyAccessToken, getAllTasksInCollection)

// Route to edit an existing task in a collection
router.put("/edit-task", verifyAccessToken, editTask);

// Route to delete a task from a collection
router.delete("/delete-task", verifyAccessToken, deleteTask);

// Route to Toggle Task Completion
router.put("/toggle-task-checked", verifyAccessToken, toggleTaskCompletion)

// Route to change index position of an individual task element
// router.put("/change-task-position", changeTaskIndex) //  //not usable for now


export default router;
