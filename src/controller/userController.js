const ConnectionSchema = require("../models/request.model");

exports.receivedConnection = async (req, res) => {
  const ALLOWED_FIELD = [
    "firstName",
    "lastName",
    "profilePicture",
    "skills",
    "bio",
    "email",
  ];
  try {
    const loggedInUser = req.user.id;
    const receivedConnections = await ConnectionSchema.find({
      recipient: loggedInUser,
      status: "interested",
    }).populate("sender", ALLOWED_FIELD);

    const data = receivedConnections.map((conn) => conn.sender);

    res.json({
      message: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching connections: " + error.message,
    });
  }
};

exports.addedConnection = async (req, res) => {
  loggedInId = req.user.id;
  const ALLOWED_FIELD = [
    "firstName",
    "lastName",
    "profilePicture",
    "skills",
    "bio",
    "email",
  ];
  try {
    const addedConnection = await ConnectionSchema.find({
      $or: [{ sender: loggedInId }, { recipient: loggedInId }],
      status: "accepted",
    })
      .populate("sender", ALLOWED_FIELD)
      .populate("recipient", ALLOWED_FIELD);

    if (!addedConnection || addedConnection.length === 0) {
      return res.status(404).json({ message: "No connections found." });
    }

    const formattedConnections = addedConnection.map((connection) => {
      // Determine if the logged-in user is the sender or recipient
      const isSender =
        connection.sender._id.toString() === loggedInId.toString();
      const connectedUser = isSender ? connection.recipient : connection.sender;

      return {
        connectionId: connection._id,
        user: connectedUser,
        status: connection.status,
        createdAt: connection.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      connections: formattedConnections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching connections: " + error.message,
    });
  }
};
