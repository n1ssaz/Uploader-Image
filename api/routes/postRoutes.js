import express from "express";
import verifyToken,{verifyOptionalToken} from "../middleware/auth.js";
import { createPost,getAllPosts, getPostById, likePost,getComments,addComment} from "../controllers/postController.js";
import upload from "../config/multer.js";
const router = express.Router();

// Create a post (requires authentication)
router.post("/", verifyToken, upload.single("image"), createPost);

// Get all posts
router.get("/", verifyOptionalToken, getAllPosts);

router.get("/:id", verifyOptionalToken, getPostById); // Public, but will check if user liked it
router.post("/:id/like", verifyOptionalToken, likePost); // Public, but will check if user liked it

router.get("/:id/comments",verifyOptionalToken,getComments);

// Add a comment to a post (requires authentication)
router.post("/:id/comments", verifyToken, addComment);

export default router;
