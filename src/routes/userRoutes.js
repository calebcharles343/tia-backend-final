"use strict";

const express = require("express");
const {
  deleteUser,
  getAllInactiveUsers,
  getAllUsers,
  getUserById,
  updateMe,
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

const userRouter = express.Router();

/*//////////////////////*/
/*AUTHENTICATION ROUTE*/
/*//////////////////////*/
// These are special endpoints that do not 100% fit the REST philosophy

/*//////////////////////*/
userRouter.post("/signup", singupValidator, signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forgotPassword", forgotPassword);

/*
resetPassword is a patch request because we are modifying the
password property of the user document
*/
userRouter.patch("/resetPassword/:token", resetPassword);

userRouter.patch("/updatePassword", protect, updatePassword);

userRouter.patch("/updateMe/:id", protect, updateMe);
userRouter.delete("/deleteMe/:id", protect, deleteUser);

userRouter.get(
  "/closedAccounts",
  protect,
  restrictTo("Admin"),
  getAllInactiveUsers
);

/*//////////////////////*/
/*BASIC CRUD ROUTE*/
/*//////////////////////*/
userRouter
  .route("/")
  .get(protect, changedPasswordAfterToken, restrictTo("Admin"), getAllUsers);

userRouter
  .route("/:id")
  .get(protect, getUserById)
  .patch(updateMe)
  .delete(deleteUser);

module.exports = userRouter;
