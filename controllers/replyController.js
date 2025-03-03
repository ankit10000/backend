const fs = require("fs");
const nodemailer = require("nodemailer");
const connectDB = require("../config/db");

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD // Your email password
    }
});

// Function to send a reply via email and save to Notepad
const sendReply = async (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ message: "Email, subject, and message are required" });
    }

    try {
        // Sending Email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject,
            text: message
        });

        const replyData = {
            email,
            subject,
            message,
            timestamp: new Date().toISOString(),
        };

        // Append reply to Notepad file
        fs.appendFile("replies.txt", JSON.stringify(replyData) + "\n", (err) => {
            if (err) {
                console.error("Error writing to file", err);
                return res.status(500).json({ message: "Error saving reply to file" });
            }
            res.json({ message: "Reply sent and saved successfully!" });
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
};

// Function to parse Notepad replies and store in MongoDB
const parseRepliesToMongoDB = async () => {
    try {
        if (!fs.existsSync("replies.txt")) return;

        const data = fs.readFileSync("replies.txt", "utf-8");
        if (!data.trim()) return;

        const db = await connectDB();
        const collection = db.collection("replies");

        const records = data
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));

        await collection.insertMany(records);

        console.log("Replies inserted into MongoDB successfully!");

        // Clear the file after inserting into DB
        fs.writeFileSync("replies.txt", "");
    } catch (err) {
        console.error("Error processing file:", err);
    }
};

// Schedule the function to run every 5 minutes
setInterval(parseRepliesToMongoDB, 1000);

// Function to fetch replies from MongoDB
const getAllReplies = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("replies");

        const replies = await collection.find().toArray();

        res.json({ success: true, data: replies });
    } catch (err) {
        console.error("Error fetching replies:", err);
        res.status(500).json({ success: false, message: "Error fetching replies" });
    }
};
const getRepliesByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const db = await connectDB();
        const collection = db.collection("replies");

        const replies = await collection.find({ email }).toArray();

        res.json({ success: true, data: replies });
    } catch (err) {
        console.error("Error fetching replies:", err);
        res.status(500).json({ success: false, message: "Error fetching replies" });
    }
};


module.exports = { sendReply, getAllReplies, getRepliesByEmail };
