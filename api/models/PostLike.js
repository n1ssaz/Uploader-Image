import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Post from "./Post.js";

const PostLike = sequelize.define("PostLike", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

PostLike.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
PostLike.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

export default PostLike;
