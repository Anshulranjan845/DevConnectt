const express = require("express");
const feedController = require("../controller/feedController");

const feedRouter = express.Router();

feedRouter.get("/", feedController.getFeed);

module.exports = feedRouter;
