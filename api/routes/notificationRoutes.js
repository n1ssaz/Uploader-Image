import express from "express";
import { getNotifications, deleteNotification,clearNotifications } from "../controllers/notificationController.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.get("/", verifyToken, getNotifications); // Fetch notifications
router.delete("/:id", verifyToken, deleteNotification); // Delete a single notification
router.delete("/clear", verifyToken, clearNotifications); // Clear all notifications

export default router;
