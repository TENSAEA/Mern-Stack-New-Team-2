const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
