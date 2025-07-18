const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user.model");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const UserDetail = await User.findOne({ email: userEmail });
    if (!UserDetail) {
      throw new Error("User not found");
    }
    res.send(UserDetail);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.get("/userfeed", async (req, res) => {
  try {
    const feed = await User.find({}).select("-password");
    if (!feed) {
      res.status(404).send("No data available");
    } else {
      res.send(feed);
    }
  } catch (err) {
    res.status(500).send("Server error");
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
