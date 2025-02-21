const fs = require("fs");
const connectDB = require("../config/db");

const saveToNotepad = (req, res) => {
    const { app_version,
        app_name,
        date,
        description,
        device_model,
        device_token,
        email,
        from_screen,
        like_dislike,
        os_version,
        rate_star } = req.body;

    if (!app_version ||
        !app_name ||
        !date ||
        !description ||
        !device_model ||
        !device_token ||
        !email ||
        !from_screen ||
        !like_dislike ||
        !os_version ||
        !rate_star) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userData = {
        app_version,
        app_name,
        date,
        description,
        device_model,
        device_token,
        email,
        from_screen,
        like_dislike,
        os_version,
        rate_star,
        timestamp: new Date().toISOString(),
    };

    const formattedData = JSON.stringify(userData) + "\n";

    fs.appendFile("data.txt", formattedData, (err) => {
        if (err) {
            console.error("Error writing to file", err);
            return res.status(500).json({ message: "Error writing to file" });
        }
        res.json({ message: "Data saved to Notepad successfully!" });
    });
};

const parseNotepadDataToMongoDB = async () => {
    try {
        if (!fs.existsSync("data.txt")) return;

        const data = fs.readFileSync("data.txt", "utf-8");
        if (!data.trim()) return;

        const db = await connectDB();
        const collection = db.collection("feedback");

        const records = data
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));

        await collection.insertMany(records);

        console.log("Data inserted into MongoDB successfully!");

        fs.writeFileSync("data.txt", "");

    } catch (err) {
        console.error("Error processing file:", err);
    }
};

setInterval(parseNotepadDataToMongoDB, 10000);
const getFeedback = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("feedback");

        const employees = await collection.find().toArray();

        res.json({ success: true, data: employees });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};

module.exports = { saveToNotepad, getFeedback };
