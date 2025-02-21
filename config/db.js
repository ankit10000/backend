const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "user_feedback";

let db;

const connectDB = async () => {
    if (!db) {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log("MongoDB Connected");
    }
    return db;
};

module.exports = connectDB;
