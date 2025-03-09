import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Post from "./Post.js";

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false },
});

Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

export default Comment;
