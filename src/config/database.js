const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://coderun010101:LetsConnect2025@cluster0.vdgnihu.mongodb.net/DevConnect"
  );
  console.log("Database connected");
};

module.exports = connectDB;
