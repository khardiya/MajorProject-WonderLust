const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLASDB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB not ready. Retrying in 15 seconds...");
    setTimeout(connectDB, 15000);
  }
};

module.exports = connectDB;
