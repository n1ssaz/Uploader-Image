import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ObjectId } from "mongodb";
import { startMemoryDB, stopMemoryDB, getDB } from "./db/memoryDB.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

await startMemoryDB();

const getUsersCollection = () => getDB().collection("users");
const getFilesCollection = () => getDB().collection("files");

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await getUsersCollection().insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUsersCollection().findOne({ username });
    console.log(user)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, username, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/files/:id", async (req, res) => {
  try {
    const files = await getFilesCollection().find({ id: req.params.id }).toArray();
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve files" });
  }
});

app.post("/files/:id", async (req, res) => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid files data" });
    }

    const collection = getFilesCollection();
    await collection.insertMany(files.map((file) => ({ ...file, id: req.params.id })));

    const updatedFiles = await collection.find({ id: req.params.id }).toArray();
    res.status(200).json(updatedFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File upload failed" });
  }
});

app.delete("/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await getFilesCollection().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const updatedFiles = await getFilesCollection().find().toArray();
    res.status(200).json(updatedFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

process.on("SIGTERM", async () => {
  await stopMemoryDB();
  process.exit(0);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
