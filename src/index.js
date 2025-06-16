import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { Server as Engine } from "engine.io";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5050;
const server = createServer(app);

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

// DB connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb+srv://ducduy2408:duy123123@healthcare.wj3pdm4.mongodb.net/?retryWrites=true&w=majority&appName=healthcare";
    console.log("Attempting to connect to MongoDB:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/healthcare/heartrate", (req, res) => {
  res.json({ message: "Welcome to Health Care API" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Socket.IO
const io = new SocketIOServer(server);
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  io.emit("event", { message: "Hello from the server!" });
  socket.on("event", (data) => {
    console.log("Data:", data);
  });
});
