"use strict";

const express = require("express");
const {
  deleteUser,
  getAllInactiveUsers,
  getAllUsers,
  getUserById,
  updateMe,
  updateUserRole,
} = require("../controllers/userController.js");
const singupValidator = require("../middleware/singupValidator.js");
const {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  updatePassword,
} = require("../controllers/authController.js");
const protect = require("../middleware/protect.js");
const changedPasswordAfterToken = require("../middleware/changedPasswordAfterToken.js");
const restrictTo = require("../middleware/restrictTo.js");
const userStatus = require("../middleware/userStatus.js");

const userRouter = express.Router();

/*//////////////////////*/
/*AUTHENTICATION ROUTE*/
/*//////////////////////*/
userRouter.post("/signup", singupValidator, signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.patch("/updatePassword", protect, updatePassword);

/*//////////////////////*/
/*BASIC CRUD ROUTE*/
/*//////////////////////*/
userRouter.get(
  "/",
  protect,
  changedPasswordAfterToken,
  restrictTo("Admin"),
  getAllUsers
);
userRouter.patch(
  "/updateUserRole/:userId",
  protect,
  restrictTo("Admin"),
  userStatus("Admin", "User"),
  updateUserRole
);
userRouter.route("/user").get(protect, getUserById);
userRouter.patch("/updateMe", protect, updateMe);
userRouter.delete("/deleteMe", protect, deleteUser);

module.exports = userRouter;
