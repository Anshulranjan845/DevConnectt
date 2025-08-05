const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["interested", "pass", "accepted", "cancelled"],
    },
  },
  { timestamps: true }
);

requestSchema.pre("save", function (next) {
  const connection = this;
  if (connection.sender.equals(connection.recipient)) {
    throw new Error("Cannot send request to yourself");
  }
  next();
});
requestSchema.index({ sender: 1, recipient: 1 }, { unique: true });
const ConnectionSchema = mongoose.model("ConnectionSchema", requestSchema);

module.exports = ConnectionSchema;
