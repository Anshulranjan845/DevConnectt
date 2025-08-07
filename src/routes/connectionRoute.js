const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const connectionController = require("../controller/connectionController");

const connectionRouter = express.Router();

connectionRouter.post(
  "/send/:status/:userId",
  authMiddleware,
  connectionController.sendConnectionUser
);
connectionRouter.post(
  "/review/:status/:userId",
  authMiddleware,
  connectionController.receiveConnectionUser
);

module.exports = connectionRouter;
