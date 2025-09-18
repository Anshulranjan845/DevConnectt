const mongoose = require("mongoose");
const ConnectionSchema = require("../models/request.model");

exports.receiveConnectionUser = async (req, res) => {
  const receiver = req.user.id;
  const sender = req.params.userId;
  const status = req.params.status;
  const allowedStatus = ["accepted", "cancelled"];

  if (!allowedStatus.includes(status.toLowerCase().trim())) {
    return res.status(400).json({
      message: "Invalid status: " + status,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    return res.status(400).json({ error: "Invalid User ID Format" });
  }
  try {
    const userConnection = await ConnectionSchema.findOne({
      sender: sender,
      recipient: receiver,
      status: "interested",
    });

    if (!userConnection) {
      return res.status(400).json({
        message: "Connection not found",
      });
    }
    userConnection.status = status;

    await userConnection.save();

    res.status(200).json({ message: "Connection accepted" });
  } catch (error) {
    res.status(400).json({ message: "ERROR :" + error.message });
  }
};

exports.sendConnectionUser = async (req, res) => {
  const sender = req.user.id;
  const receiver = req.params.userId;
  const status = req.params.status;

  const allowedStatus = ["interested", "pass"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "status is undefined :" + status,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    return res.status(400).json({ error: "Invalid User ID Format" });
  }
  try {
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

    if (status === "pass") {
      res.json({
        message: "Connection ignored",
        availableConnection,
      });
    } else {
      res.json({
        message: "Connection sent",
        availableConnection,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "ERROR :" + error.message });
  }
};
