const express = require("express");
const dotenv = require("dotenv");
const notepadRoutes = require("./routes/notepadRoutes");
const replyRoutes = require("./routes/replyRoutes");
const connectDB = require("./config/db");
const cors = require("cors");
// Connect to MongoDB


dotenv.config();
connectDB();

// Create express app

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", notepadRoutes);
app.use("/api", replyRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
