const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const { verifyToken } = require("./middleware/authMiddleware");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/recipes", verifyToken, recipeRoutes);

// WebSocket for real-time updates
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("recipeUpdated", () => {
        io.emit("updateRecipes");
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(Server running on port ${PORT}));