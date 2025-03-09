"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // For redirecting
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // React Icons
import api from "@/api/api";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/user/register", { username, password });
            toast.success("✅ Registration successful! Redirecting to login...");

            setTimeout(() => {
                router.push("/login"); // Redirect to login page after success
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "❌ Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="p-8 bg-white rounded-lg shadow-md w-full max-w-md border border-gray-200"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

                {/* Username Input */}
                <label className="text-gray-700 text-sm font-medium">Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
                />

                {/* Password Input */}
                <label className="text-gray-700 text-sm font-medium mt-4 block">Password</label>
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full mt-6 p-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Sign Up"}
                </button>

                {/* Redirect to Login */}
                <p className="text-center text-gray-600 text-sm mt-4">
                    Already have an account?{" "}
                    <span
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => router.push("/login")}
                    >
                        Log in
                    </span>
                </p>
            </form>
        </div>
    );
}
