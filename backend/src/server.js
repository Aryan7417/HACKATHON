const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "VoxInterview AI Backend is running 🚀",
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is healthy",
        service: "VoxInterview AI",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 VoxInterview Backend running on port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
});