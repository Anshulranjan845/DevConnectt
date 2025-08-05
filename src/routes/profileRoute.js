const express = require("express");
const profileController = require("../controller/profileController");

const profileRouter = express.Router();

profileRouter.get("/profile/view", profileController.getProfile);
profileRouter.patch("/profile/update", profileController.updateProfile);

module.exports = profileRouter;
