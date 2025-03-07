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

// Store active SSE clients
const clients = [];

// SSE Endpoint - Listen for Events
app.get("/events", (req, res) => {
  console.log("🔗 New SSE Connection");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  // Remove client on disconnect
  req.on("close", () => {
    clients.splice(clients.indexOf(res), 1);
    console.log("❌ SSE Connection Closed");
  });
});

const sendEventToClients = (event, data) => {
  console.log(`📢 Broadcasting SSE Event: ${event}`, data);

  clients.forEach(client => {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// User Registration
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await getUsersCollection().insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUsersCollection().findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "1h",
    });
    res.status(200).json({ token, username, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get all files for a user
app.get("/files/:id", async (req, res) => {
  try {
    const files = await getFilesCollection().find({ id: req.params.id }).toArray();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve files" });
  }
});

// ✅ Upload Files and Trigger SSE Notification
app.post("/files/:id", async (req, res) => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid files data" });
    }

    const collection = getFilesCollection();
    await collection.insertMany(files.map((file) => ({ ...file, id: req.params.id })));
    const updatedFiles = await collection.find({ id: req.params.id }).toArray();
    sendEventToClients("file-upload", { message: "📢 A new file was uploaded!", files });
    res.status(200).json(updatedFiles);
  } catch (error) {
    console.error("❌ Error in file upload:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// Delete a file
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
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await stopMemoryDB();
  process.exit(0);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
