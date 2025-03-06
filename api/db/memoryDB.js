import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { users } from "./data/data.js";

let mongod;
let mongoClient;
let db;

export async function startMemoryDB() {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log("✅ MongoMemoryServer started at", uri);

    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    db = mongoClient.db();

    const existingUsers = await db.collection("users").countDocuments();
    if (existingUsers === 0) {
      await db.collection("users").insertMany(users);
      console.log("Seeded users:", await db.collection("users").find().toArray());
    } else {
      console.log("Database already contains data. Skipping seeding.");
    }
  }
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Memory DB has not been started yet!");
  }
  return db;
}

export async function stopMemoryDB() {
  if (mongoClient) {
    await mongoClient.close();
    console.log("MongoDB connection closed");
  }
  if (mongod) {
    await mongod.stop();
    console.log("MongoMemoryServer stopped");
  }
}
