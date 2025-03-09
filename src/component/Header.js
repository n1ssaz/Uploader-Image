"use client";

import { useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuthStore();
  const { notifications, deleteNotification, clearNotifications } = useNotificationStore();
  const router = useRouter();

  const handleNotificationClick = async (notification) => {
    await deleteNotification(notification.id); // Delete notification
    router.push(`/post/${notification.postId}`); // Navigate to post
  };

  return (
    <header className="flex justify-between items-center bg-gray-800 text-white p-5 shadow-lg relative">
      <h1 className="text-2xl font-semibold">Imgur</h1>

      <div className="space-x-4 flex items-center">
        {user && (
          <button
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            onClick={() => router.push("/create-post")}
          >
            ✨ Create Post
          </button>
        )}

        {user && (
          <div className="relative">
            <button
              className="relative px-4 py-2 hover:bg-gray-700 rounded-lg"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <BellOutlined className="text-xl" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 text-sm flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No new notifications</p>
                ) : (
                  <ul className="max-h-40 overflow-y-auto">
                    {notifications.map((notification, idx) => (
                      <li
                        key={idx}
                        className="p-2 border-b border-gray-200 text-sm text-black cursor-pointer hover:bg-gray-100"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {notification.message}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                  onClick={clearNotifications}
                >
                  Clear Notifications
                </button>
              </div>
            )}
          </div>
        )}

        {!user ? (
          <>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
            <button
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span className="text-lg">Hello, {user.username}</span>
            <button
              className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
              onClick={logout}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
