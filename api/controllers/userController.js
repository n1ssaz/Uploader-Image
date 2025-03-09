import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/index.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret-key", {
      expiresIn: "5h",
    });

    res.json({ token, userId: user.id, username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
