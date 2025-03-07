const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const connectDB1 = require("./config/db1");

const notepadRoutes = require("./routes/notepadRoutes");
const replyRoutes = require("./routes/replyRoutes");
const authRoutes = require("./routes/authRoutes");
const assignAppRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();
connectDB1();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/notepad", notepadRoutes);
app.use("/api/reply", replyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", assignAppRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
