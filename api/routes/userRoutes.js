import express from "express";
import { loginUser, registerUser, } from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Get user details (Requires authentication)
router.post("/register", registerUser);

// Update user details (Requires authentication)
router.post("/login", loginUser);

export default router;
