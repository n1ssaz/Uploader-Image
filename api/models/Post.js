import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Post = sequelize.define("Post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
});

Post.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export default Post;
