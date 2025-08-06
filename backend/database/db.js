const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); 

const DBConnection = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error("MONGODB_URI environment variable is not set");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = { DBConnection };