import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDatabase } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js";
import { eventsHandler } from "./config/sseService.js";
// Use notification routes
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));


app.use((req, res, next) => {
  const start = Date.now();
  console.log(`📥 [${req.method}] ${req.originalUrl} | Query: ${JSON.stringify(req.query)}`);

  if (Object.keys(req.body).length > 0) {
    console.log(`🔹 Request Body: ${JSON.stringify(req.body)}`);
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`📤 Response: ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Routes
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.get("/events", eventsHandler); // SSE Endpoint
// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
