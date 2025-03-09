"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/api/api";

export default function CreatePostPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle Post Creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!image || !description.trim()) {
      toast.error("❌ Image and description are required!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);

      await api.post("/posts", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("✅ Post created successfully!");
      setTimeout(() => router.push("/"), 2000); // Redirect after success
    } catch (error) {
      toast.error(error.response?.data?.error || "❌ Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">⚠️ You must be logged in to create a post.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleCreatePost} className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Create a Post</h2>

        {/* Image Upload */}
        <label className="text-gray-600 text-sm font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full p-2 border rounded mt-1 bg-gray-50 shadow-sm"
        />

        {/* Image Preview */}
        {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover mt-3 rounded-lg" />}

        {/* Description */}
        <label className="text-gray-600 text-sm font-medium mt-4 block">Description</label>
        <textarea
          placeholder="Write something..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 p-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
