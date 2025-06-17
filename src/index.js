"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));

dotenv_1.default.config();

const app = (0, express_1.default)();
const port = process.env.PORT || 5050;
const server = require("http").createServer(app);

// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "*",  // Allow all origins for testing, chỉnh sau khi production
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://ducduy2408:duy123123@healthcare.wj3pdm4.mongodb.net/healthcare?retryWrites=true&w=majority&appName=healthcare";
        console.log("Attempting to connect to MongoDB:", mongoURI);
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
connectDB();

// Schema + model
const heartRateSchema = new mongoose_1.default.Schema({
    averagerate: Number,
    bloodpresure: String,
    maxrate: Number,
    minrate: Number,
    user: mongoose_1.default.Schema.Types.ObjectId
}, { collection: 'heartrates' });

const HeartRate = mongoose_1.default.model("HeartRate", heartRateSchema);

// Routes
app.use("/api/auth", auth_routes_1.default);

// API trả data chuẩn JSON
app.get("/api/healthcare/heartrate", async (req, res) => {
    try {
        const data = await HeartRate.find({}).lean();  // dùng .lean() để trả JSON gọn hơn
        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Error fetching heart rates:", err);
        res.status(500).json({ success: false, error: "Failed to fetch heart rate data" });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// Server start
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Socket.io (nếu bạn cần realtime)
const io = require('socket.io')(server);
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.emit("event", { message: "Hello from the server!" });
    socket.on("event", (data) => {
        console.log("Received data from client:", data);
    });
});
