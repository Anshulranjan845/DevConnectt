const express = require("express");
const userController = require("../controller/userController");

const userRoute = express.Router();

userRoute.get("/received", userController.receivedConnection);
userRoute.get("/connections", userController.addedConnection);

module.exports = userRoute;
