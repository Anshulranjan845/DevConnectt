const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const User = require("./models/user.model");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const connectionRouter = require("./routes/connectionRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoute);

//app.use("/", authRoute);

app.use("/", authMiddleware, profileRoute);

app.use("/request/send", authMiddleware, connectionRouter);

app.get("/userfeed", authMiddleware, async (req, res) => {
  const user = req.user;
  try {
    const feed = await User.find({}).select("-password");
    if (!feed) {
      res.status(404).send("No data available");
    } else {
      res.send(feed);
    }
    console.log(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.delete("/deleteuser", authMiddleware, async (req, res) => {
  const userdelete = req.body.userId;
  if (!userdelete) {
    return res.status(400).json({ error: "User ID is required" });
  }
  // Validate if userId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userdelete)) {
    return res.status(400).json({ error: "Invalid User ID format" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userdelete);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send("User got deleted");
  } catch (error) {
    res.status(400).send("facing issue");
  }
});

app.patch("/update/:userId", authMiddleware, async (req, res) => {
  const user_id = req.params?.userId;
  // const { skills, ...data } = req.body;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ error: "Invalid User ID Format" });
  }
  try {
    const ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "email",
      "bio",
      "profilePicture",
      "gender",
      "skills",
    ];

    const updateAllowed = Object.keys(req.body).every((data) =>
      ALLOWED_UPDATE.includes(data)
    );

    if (!updateAllowed) {
      return res.status(400).send("Invalid schema to update");
    }

    const updateUser = await User.findByIdAndUpdate(user_id, req.body, {
      runValidators: true,
    }).select("-password");

    if (!updateUser) {
      return res.status(400).json({ error: "User is not found" });
    }
    res.json({
      message: "Updated successfully",
      data: updateUser,
    });
  } catch (error) {
    res.status(400).send("facing issue");
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
