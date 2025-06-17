import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { Server, Socket } from "socket.io";
// Load environment variables before other imports
import { Server as Engine } from "engine.io";
import { createServer } from "node:http";

// const httpServer = createServer((req, res) => {
//   res.writeHead(404).end();
// });
// const engine = new Engine();

// engine.attach(httpServer, {
//   path: "/socket.io/"
// });
dotenv.config();

const app = express();
const port = process.env.PORT || 5050;
const server = require("http").createServer(app);
// const mongoose = require("mongoose");
const { EJSON, Int32, Double, ObjectId } = require("bson");

// io.bind(engine);

// console.log(io._parser);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5050",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://ducduy2408:duy123123@healthcare.wj3pdm4.mongodb.net/healthcare?retryWrites=true&w=majority";
    console.log("Attempting to connect to MongoDB:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

/// Schema
const heartRateSchema = new mongoose.Schema({
  averagerate: Number,
  bloodpresure: String,
  maxrate: Number,
  minrate: Number,
  user: mongoose.Schema.Types.ObjectId
}, { collection: 'heartrate' });

// Model (nên để tên model số ít, Mongoose tự hiểu và map sang collection)
const HeartRate = mongoose.model("HeartRate", heartRateSchema, "heartrate");

// Route
app.get("/api/healthcare/heartrate", async (req, res) => {
  try {
    console.log("📌 API /api/healthcare/heartrate called");
    console.log("📌 Mongoose readyState:", mongoose.connection.readyState);
    console.log("📌 DB Name:", mongoose.connection.name);

    const rawData = await HeartRate.find().lean();
    console.log("📌 rawData:", rawData);

    const data = rawData.map(doc => ({
      _id: doc._id.toString(),
      averagerate: doc.averagerate,
      bloodpresure: doc.bloodpresure,
      maxrate: doc.maxrate,
      minrate: doc.minrate,
      user: doc.user ? doc.user.toString() : null
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error fetching heart rates:", err);
    res.status(500).json({ success: false, error: "Failed to fetch heart rate data" });
  }
});





// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});
// Start server
app.listen(5050, '0.0.0.0', () => {
  console.log(`✅ Server is running at http://192.168.1.6:5050/api/healthcare/heartrate`);
});
const io = require('socket.io')(server);
io.on("connection", (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);
  io.emit("event", { message: "Hello from the server!" });
  socket.on("event", (data: any) => {
    console.log("Data:",data);
  });
});