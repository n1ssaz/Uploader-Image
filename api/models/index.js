import sequelize from "../config/database.js";
import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";
import Notification from "./Notification.js";
import PostLike from "./PostLike.js";



// Sync database
const initDatabase = async () => {
  await sequelize.sync({ alter: true }); // Update tables if needed
  console.log("✅ Database synced!");
};

export { sequelize, User, Post, Comment, Notification,PostLike, initDatabase };
