const ConnectionSchema = require("../models/request.model");
const User = require("../models/user.model");

exports.getFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const user = req.user;
  const USER_SELECTED_FIELD =
    "firstName lastName email profilePicture bio gender skills";
  try {
    const connectedUser = await ConnectionSchema.find({
      $or: [{ sender: user.id }, { recipient: user.id }],
    }).select("sender recipient");

    const hideUser = new Set();

    connectedUser.forEach((q) => {
      hideUser.add(q.sender.toString());
      hideUser.add(q.recipient.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUser) } },
        { _id: { $ne: user.id } },
      ],
    })
      .select(USER_SELECTED_FIELD)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
