import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
//import userController from "../controllers/user.controller.js";
import {
  registerUser,
  getAllUsersCount,
  getUserProfile,
  updateUserStatus,
  deleteUser,
  getSearchedUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  updateUserProfile,
  updateUserAvatar,
  resetPassword,
  fetchDashboard,
  fetchAllUsers,
} from "../controllers/user.controller.js";

const userRouter = Router();

// Register new User
userRouter.post("/register", upload('users').array("avatar", 1),  registerUser);
//Update User
userRouter.patch("/update/:id", upload('users').array({ name: "avatar", maxCount: 1 }),  updateUserProfile);
//Login User
//userRouter.post("/login", loginUser);
//Get Users count
userRouter.get("/total-users", getAllUsersCount);
//Get User Profile
userRouter.get("/profile/:id", getUserProfile);
//Change User status (isActive)
userRouter.patch('/update-status/:id', updateUserStatus);
//Delete User permanently
userRouter.delete("/delete/:id", deleteUser)
//Search User
userRouter.get("/search-user", getSearchedUsers)
userRouter.post("/login", loginUser);

// secured routes 
userRouter.post("/logout", verifyJWT, logoutUser)
// Refresh Access Token
userRouter.post("/refresh-token", refreshAccessToken);
//Change Password
userRouter.post("/change-password", verifyJWT, changeCurrentUserPassword);
//Change Avatar
userRouter.patch("/change-avatar", verifyJWT, upload('products').single("avatar"), updateUserAvatar);
//Reset Password
userRouter.put("/reset-password/:reset_token", resetPassword);
//Get Users count
userRouter.get("/all-users", fetchAllUsers);
userRouter.get("/dashboard", fetchDashboard);
export default userRouter;  
