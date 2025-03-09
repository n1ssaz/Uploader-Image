"use client";
import { useState } from "react";
import { Modal, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import api from "@/api/api";

export default function Register({ isOpen, onClose, isLogin, toggleAuth, setLoggedUser }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // Handle Login
                const response = await api.post("/user/login", { username, password });
                setLoggedUser(response.data);
            } else {
                // Handle Register
                await api.post("/user/register", { username, password });
                alert("Registration successful! You can now log in.");
            }

            setUsername("");
            setPassword("");
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || (isLogin ? "Login failed." : "Registration failed."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onCancel={onClose} footer={null} centered className="rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-4 w-full max-w-sm mx-auto">
                <h2 className="text-2xl font-semibold text-center">
                    {isLogin ? "Log in to your account" : "Create an account"}
                </h2>

                <label className="text-gray-600 text-sm">Username</label>
                <Input
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className="text-gray-600 text-sm">Password</label>
                <Input
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    suffix={
                        showPassword ? (
                            <EyeOutlined onClick={() => setShowPassword(false)} className="cursor-pointer" />
                        ) : (
                            <EyeInvisibleOutlined onClick={() => setShowPassword(true)} className="cursor-pointer" />
                        )
                    }
                />

                <Button
                    type="primary"
                    htmlType="submit"
                    className={`w-full h-10 mt-2 ${isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
                    loading={loading}
                >
                    {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Sign in" : "Sign up"}
                </Button>

                <p className="text-center text-gray-600 text-sm mt-3">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                    <span
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        onClick={toggleAuth}
                    >
                        {isLogin ? "Sign up now" : "Log in"}
                    </span>
                </p>
            </form>
        </Modal>
    );
}
