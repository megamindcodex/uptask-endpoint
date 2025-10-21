// Routers to handle auth related routes and connect to controllers
import express from "express";
import { createUser } from "../controllers/auth/createUser.js";
import { loginUser } from "../controllers/auth/loginUser.js";
import { request_password_reset_code } from "../controllers/auth/requestResetCode.js";
import { resetPassword } from "../controllers/auth/resetPassword.js"

const router = express.Router();

// Route to create a new user
router.post("/register", createUser);

// Route to login a user
router.post("/user-login", loginUser);

// Route to request password reset code
router.post("/request-password-reset-code", request_password_reset_code);

// Route to reset user password
router.post("/reset-password", resetPassword)

export default router;