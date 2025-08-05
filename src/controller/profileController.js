const User = require("../models/user.model");
const mongoose = require("mongoose");
const { validateEditField } = require("../utils/validate");

exports.getProfile = async (req, res) => {
  const user = req.user;
  if (!mongoose.Types.ObjectId.isValid(user.id)) {
    return res.status(400).json({ error: "Invalid User ID Format" });
  }
  try {
    const UserDetail = await User.findOne({ _id: user.id });
    if (!UserDetail) {
      throw new Error("User not found");
    }
    res.json({
      success: true,
      data: UserDetail,
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.updateProfile = async (req, res) => {
  const loggedInUser = req.user;
  if (!mongoose.Types.ObjectId.isValid(loggedInUser.id || loggedInUser._id)) {
    return res.status(400).json({ error: "Invalid User ID Format" });
  }
  try {
    if (!validateEditField(req)) {
      res
        .status(400)
        .json({ status: "failed", message: "Unauthorized to perform" });
    }

    const user = await User.findById(loggedInUser.id);

    console.log(user);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    Object.keys(req.body).forEach((item) => (user[item] = req.body[item]));
    await user.save();
    res.send(`${user.firstName} data got updated`);
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
};
