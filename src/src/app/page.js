"use client";
import { useState, useEffect } from "react";
import SortFilter from "@/component/SortFilter";
import SearchBar from "@/component/SearchBar";
import api from "@/api/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // Import router
import useNotificationStore from "@/store/notificationStore";

export default function Home() {
  const router = useRouter()
  const [loggedUser, setLoggedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); // Store comments for the selected post
  const [newComment, setNewComment] = useState(""); // Store new comment input
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [view, setView] = useState("grid");
  const [notifications, setNotifications] = useState([]);
  const [newPost, setNewPost] = useState({ image: "", description: "" });


  const fetchPosts = async () => {
    try {
      const res = await api.get(
        "/posts",
        {},
        {
          headers: { Authorization: `Bearer ${loggedUser?.token}` },
        }
      );
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!loggedUser?.token) return;

    const eventSource = new EventSource(
      `http://localhost:3001/events?token=${loggedUser.token}`
    );

    eventSource.addEventListener("new-like", (event) => {
      console.log({ event });
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
    });

    eventSource.addEventListener("new-post", (event) => {
      console.log({ event });
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
    });

    eventSource.addEventListener("notifications", (event) => {
      console.log({ event });
      const data = JSON.parse(event.data);
      setNotifications(data);
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE Connection Error:", err);
    };

    return () => eventSource.close();
  }, [loggedUser]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    }
  };



  const handleSelectPost = (post) => {
    router.push(`/post/${post.id}`); // Navigate to post details page
  }


  const handleLike = async (postId) => {
    try {
      console.log({ a: loggedUser.token });
      const res = await api.post(
        `/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${loggedUser?.token}` },
        }
      );
      fetchPosts();
      if (selectedPost?._id === postId) {
        setSelectedPost(res.data); // Update likes if post is open
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="flex flex-col flex-1 space-y-6 overflow-y-auto">
        <div className="bg-gray-100 p-6 flex justify-between items-center w-full">
          <SortFilter onSortChange={setSortOption} onViewChange={setView} />
          <SearchBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        </div>

        {/* Show selected post if available */}

        {filteredPosts.length > 0 ? (
          <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Posts
            </h3>
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-3 gap-6"
                  : "flex flex-col space-y-4"
              }
            >
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-4 bg-gray-200 rounded-lg">
                  <img
                    src={`http://localhost:3001${post.image}`}
                    alt={post.description}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleSelectPost(post)}
                  />
                  <p className="mt-2">{post.description}</p>
                  <p className="text-sm text-gray-500">❤️ {post.likes} Likes</p>
                  <p className="text-sm text-gray-500">
                    Author: {post.User.username}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-gray-600 text-xl">No posts found.</p>
          </div>
        )}
      </main>
    </>
  );
}
