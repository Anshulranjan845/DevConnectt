const express = require("express");
const connectionController = require("../controller/connectionController");

const connectionRouter = express.Router();

connectionRouter.post("/:status/:userId", connectionController.connectionUser);

module.exports = connectionRouter;
