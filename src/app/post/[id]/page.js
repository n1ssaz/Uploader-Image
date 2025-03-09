"use client";

import { useEffect, useState,use } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/api/api";
import { toast } from "react-toastify";
import useNotificationStore from "@/store/notificationStore"

export default function PostPage({ params }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const { id } = use(params); // Get post ID from URL params

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const { notifications } = useNotificationStore(); // Use notifications

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPost(res.data);
    } catch (error) {
      toast.error("❌ Failed to fetch post.");
    }
  };
  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      toast.error("❌ Failed to load comments.");
    }
  };

  // Fetch Post Data
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id, token,notifications]);

  // Handle Like
  const handleLike = async () => {
    if (!user) {
      toast.error("⚠️ You must be logged in to like.");
      return;
    }

    setLikeLoading(true);
    try {
      const res = await api.post(`/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost({ ...post, likes: res.data.likes, userHasLiked: true });
      toast.success("❤️ Liked!");
      fetchPost()
    } catch (error) {
      toast.error(error.response?.data?.error || "❌ Could not like the post.");
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle Comment Submission
  const handleAddComment = async () => {
    if (!user) {
      toast.error("⚠️ You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(
        `/posts/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments()
      setNewComment("");
      toast.success("💬 Comment added!");
    } catch (error) {
      toast.error("❌ Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">🔄 Loading post...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <img
          src={`http://localhost:3001${post.image}`}
          alt={post.description}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h1 className="text-2xl font-semibold mt-4">{post.description}</h1>
        <p className="text-gray-600 mt-2">❤️ {post.likes} Likes</p>

        {/* Like Button */}
        <button
          disabled={post.userHasLiked || likeLoading}
          className={`mt-3 px-4 py-2 rounded ${
            post.userHasLiked ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          } text-white font-semibold`}
          onClick={handleLike}
        >
          {likeLoading ? "Liking..." : post.userHasLiked ? "❤️ Liked" : "🤍 Like"}
        </button>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Comments</h2>
          {comments?.length === 0 ? (
            <p className="text-gray-500 mt-2">No comments yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {comments?.map((comment, idx) => (
                <li key={idx} className="p-2 bg-gray-200 rounded-md">
                  <strong>{comment.User.username}:</strong> {comment.text}
                </li>
              ))}
            </ul>
          )}

          {/* Add a Comment */}
          {user && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleAddComment}
                disabled={loading}
              >
                {loading ? "Adding..." : "Comment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
