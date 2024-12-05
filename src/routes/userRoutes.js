import express from "express";
import {
  deleteUser,
  getAllInactiveUsers,
  getAllUsers,
  getUserById,
  updateMe,
} from "../controllers/userController.js";
import singupValidator from "../middleware/singupValidator.js";
import {
  changedPasswordAfterToken,
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from "../controllers/authController.js";

const userRouter = express.Router();

/*//////////////////////*/
/*AUTHENTICATION ROUTE*/
/*//////////////////////*/
//These are special end points that do not 100% fit the rest philosophy

/*//////////////////////*/
userRouter.post("/signup", singupValidator, signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forgotPassword", forgotPassword);

/*
resetPassword is a patch requet because we a modifying the\ 
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
userRouter.route("/").get(protect, changedPasswordAfterToken, getAllUsers);

userRouter
  .route("/:id")
  .get(protect, getUserById)
  .patch(updateMe)
  .delete(deleteUser);

export default userRouter;
