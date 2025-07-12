const express = require("express");
const connectDB = require("./config/database");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("First response fron express server");
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("🚀 Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database. Server not started.");
  });
