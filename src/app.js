const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user.model");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const userDoc = await User.create(req.body);
    res.status(201).send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
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
