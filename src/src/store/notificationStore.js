import { create } from "zustand";
import api from "@/api/api";
import useAuthStore from "./authStore";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  eventSource: null,

  // Fetch notifications from the backend
  fetchNotifications: async () => {
    try {
      const { token } = useAuthStore.getState();
      if (!token) return;

      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ notifications: res.data });
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  },

  // Delete a single notification
  deleteNotification: async (notificationId) => {
    try {
      const { token } = useAuthStore.getState();
      if (!token) return;

      await api.delete(`/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
      }));
    } catch (error) {
      console.error("❌ Failed to delete notification:", error);
    }
  },

  // Start SSE Event Listener
  startListening: () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    const eventSource = new EventSource(`http://localhost:3001/events?token=${token}`);

    eventSource.addEventListener("notification-update", () => {
      get().fetchNotifications();
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE Connection Error:", err);
      eventSource.close();
    };

    set({ eventSource });
  },

  // Stop SSE Listening
  stopListening: () => {
    const { eventSource } = get();
    if (eventSource) {
      eventSource.close();
      set({ eventSource: null });
    }
  },

  // Clear all notifications after viewing
  clearNotifications: async () => {
    try {
      const { token } = useAuthStore.getState();
      if (!token) return;

      await api.delete("/notifications/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ notifications: [] });
    } catch (error) {
      console.error("❌ Failed to clear notifications:", error);
    }
  },
}));

export default useNotificationStore;
