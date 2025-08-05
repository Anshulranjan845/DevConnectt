const mongoose = require("mongoose");
const ConnectionSchema = require("../models/request.model");

exports.connectionUser = async (req, res) => {
  const sender = req.user.id;

  const receiver = req.params.userId;
  const status = req.params.status;

  console.log(sender);

  const allowedStatus = ["interested", "pass"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "status is undefined",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    return res.status(400).json({ error: "Invalid User ID Format" });
  }

  const userConnection = await ConnectionSchema.findOne({
    $or: [
      { sender, recipient: receiver },
      { sender: receiver, recipient: sender },
    ],
  });

  if (userConnection) {
    return res.status(400).json({
      message: "Cannection is already sent",
    });
  }

  const availableConnection = await ConnectionSchema.create({
    sender,
    recipient: receiver,
    status,
  });
  res.json({
    message: "Connection sent",
    availableConnection,
  });
};
