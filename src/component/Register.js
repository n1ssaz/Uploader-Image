"use client";
import { useState } from "react";
import { Modal, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import api from "@/api/api";

export default function AuthModals({ isLoginOpen, setLoggedUser, isRegisterOpen, closeLogin, closeRegister, openRegister }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/register", {
                username,
                password,
            });

            alert("Registration successful! You can now log in.");
            setUsername("");
            setPassword("");
            closeRegister();
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/login", {
                username,
                password,
            });
            setLoggedUser(response.data)
            setUsername("");
            setPassword("");
            closeLogin()
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                open={isLoginOpen}
                onCancel={closeLogin}
                footer={null}
                centered
                className="rounded-lg shadow-lg"
            >
                <div className="p-6 flex flex-col space-y-4 w-full max-w-sm mx-auto">
                    <h2 className="text-2xl font-semibold text-center">Log in to your account</h2>

                    <label className="text-gray-600 text-sm">Email</label>
                    <Input onChange={(e) => setUsername(e.target.value)} placeholder="Enter your email" type="email" />

                    <label className="text-gray-600 text-sm">Password</label>
                    <Input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        suffix={
                            showPassword ? (
                                <EyeOutlined onClick={() => setShowPassword(false)} className="cursor-pointer" />
                            ) : (
                                <EyeInvisibleOutlined onClick={() => setShowPassword(true)} className="cursor-pointer" />
                            )
                        }
                    />

                    <Button type="primary" className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700" onClick={handleLogin}>
                        Sign in
                    </Button>

                    <p className="text-center text-gray-600 text-sm mt-3">
                        Don’t have an account?{" "}
                        <span
                            className="text-blue-600 font-semibold cursor-pointer hover:underline"
                            onClick={() => {
                                closeLogin();
                                openRegister();
                            }}
                        >
                            Sign up now
                        </span>
                    </p>
                </div>
            </Modal>

            <Modal
                open={isRegisterOpen}
                onCancel={closeRegister}
                footer={null}
                centered
                className="rounded-lg shadow-lg"
            >
                <form onSubmit={handleRegister} className="p-6 flex flex-col space-y-4 w-full max-w-sm mx-auto">
                    <h2 className="text-2xl font-semibold text-center">Create an account</h2>

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

                    <Button type="primary" htmlType="submit" className="w-full h-10 mt-2 bg-green-600 hover:bg-green-700" loading={loading}>
                        {loading ? "Registering..." : "Sign up"}
                    </Button>

                    <p className="text-center text-gray-600 text-sm mt-3">
                        Already have an account?{" "}
                        <span
                            className="text-blue-600 font-semibold cursor-pointer hover:underline"
                            onClick={() => {
                                closeRegister();
                                openLogin();
                            }}
                        >
                            Log in
                        </span>
                    </p>
                </form>
            </Modal>
        </>
    );
}
