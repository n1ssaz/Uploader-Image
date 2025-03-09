import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  postId: { type: DataTypes.INTEGER, allowNull: true }, // Can be null for general notifications
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }, // Track if the notification was viewed
});

Notification.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export default Notification;
