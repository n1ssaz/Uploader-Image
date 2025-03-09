import { Notification } from "../models/index.js";

// ✅ Fetch All Notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

// ✅ Delete a Single Notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.destroy({
      where: { id, userId: req.userId },
    });

    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification." });
  }
};

// ✅ Clear All Notifications
export const clearNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.userId },
    });

    res.status(200).json({ message: "All notifications cleared." });
  } catch (error) {
    console.error("❌ Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications." });
  }
};
