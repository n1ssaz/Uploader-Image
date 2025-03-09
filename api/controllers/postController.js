import { Post, PostLike, User, Notification, Comment } from "../models/index.js";
import { sendEvent } from "../config/sseService.js";
// Get All Posts (Public) with Optional User Like Info
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.userId || null; // Optional authentication
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "username"] }],
    });

    let likedPostIds = [];
    if (userId) {
      // If authenticated, fetch liked posts by the user
      const userLikedPosts = await PostLike.findAll({
        where: { userId },
        attributes: ["postId"],
      });

      likedPostIds = userLikedPosts.map((like) => like.postId);
    }

    // Add `userHasLiked` only if authenticated
    const postsWithLikeInfo = posts.map((post) => ({
      ...post.toJSON(),
      userHasLiked: userId ? likedPostIds.includes(post.id) : false, // Default to false if not logged in
    }));

    res.json(postsWithLikeInfo);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Create a Post & Notify Users
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.userId;
    const postOwner = await User.findByPk(Number(userId));

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    if (!description) {
      return res.status(400).json({ error: "Description is required." });
    }

    const post = await Post.create({ userId, image: imageUrl, description });

    const allUsers = await User.findAll({
      attributes: ["id"],
    });

    const uniqueUsers = new Set(
      allUsers.map((c) => c.id).filter((uid) => uid !== userId)
    );

    const notifications = [];
    for (const recipientId of uniqueUsers) {
      notifications.push({
        userId: recipientId,
        message: `💬 ${postOwner.username} created a new post!`,
        postId: Number(post.id),
      });
    }

    await Notification.bulkCreate(notifications);
    sendEvent()

    if (postOwner.id !== userId) uniqueRecipients.add(postOwner.id);


    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Like a Post & Notify Owner
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findByPk(Number(id));
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if user already liked the post
    const existingLike = await PostLike.findOne({ where: { userId, postId: Number(id) } });
    if (existingLike) {
      return res.status(400).json({ error: "You have already liked this post." });
    }

    // Add like
    await PostLike.create({ userId, postId: Number(id) });
    await post.increment("likes");

    // Get post owner's ID
    const postOwner = await User.findByPk(post.userId);
    const postLiker = await User.findByPk(userId);

    if (post.userId !== userId) {

      // Save notification for post owner
      const notification = await Notification.create({
        userId: postOwner.id,
        message: `❤️ Your post was liked by ${postLiker.username}`,
        postId: id,
      });
    }

    // Send SSE notification
    sendEvent("post-liked");

    res.json({ message: "Post liked successfully.", likes: post.likes });
  } catch (error) {
    console.error("❌ Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};


export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id); // Convert to number
    console.log("🔹 Received ID:", id, "Type:", typeof id, "Converted to:", numericId);

    // Fetch all post IDs for debugging
    const allPosts = await Post.findAll({ attributes: ["id"] });
    console.log("📌 All Post IDs in DB:", allPosts.map((p) => p.id));

    // Try finding post by converted ID
    const post = await Post.findByPk(numericId, {
      include: [{ model: User, attributes: ["id", "username"] }],
    });

    console.log("📌 Post Found:", post ? "✅ Yes" : "❌ No");

    if (!post) return res.status(404).json({ error: "Post not found." });

    let userHasLiked = false;
    const userId = req.userId || null;
    if (userId) {
      const like = await PostLike.findOne({ where: { userId, postId: numericId } });
      userHasLiked = !!like;
    }

    res.json({ ...post.toJSON(), userHasLiked });
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post." });
  }
};

// ✅ Fetch Comments for a Post
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.findAll({
      where: { postId: Number(id) },
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

// ✅ Add a Comment & Notify Others
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty." });
    }

    const post = await Post.findByPk(Number(id));
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newComment = await Comment.create({
      userId,
      postId: Number(id),
      text,
    });

    // Get post owner and previous commenters
    const postOwner = await User.findByPk(post.userId);
    const commenter = await User.findByPk(userId);

    const otherCommenters = await Comment.findAll({
      where: { postId: Number(id) },
      attributes: ["userId"],
      group: ["userId"], // Avoid duplicate notifications
    });

    const uniqueRecipients = new Set(
      otherCommenters.map((c) => c.userId).filter((uid) => uid !== userId)
    );
    if (postOwner.id !== userId) uniqueRecipients.add(postOwner.id);

    // Save notifications
    const notifications = [];
    for (const recipientId of uniqueRecipients) {
      notifications.push({
        userId: recipientId,
        message: `💬 ${commenter.username} commented on a post you follow!`,
        postId: Number(id),
      });
    }

    await Notification.bulkCreate(notifications);

    // Notify via SSE
    sendEvent();

    // Return updated comments
    const comments = await Comment.findAll({
      where: { postId: Number(id) },
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["createdAt", "ASC"]],
    });

    res.status(201).json(comments);
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
};
