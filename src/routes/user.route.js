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
} from "../controllers/user.controller.js";

const user_route = Router();

// Register new User
user_route.post("/register", upload('users').array("avatar", 1),  registerUser);

//Update User
user_route.patch("/update/:id", upload('users').array({ name: "avatar", maxCount: 1 }),  updateUserProfile);

//Login User
//user_route.post("/login", loginUser);

//Get Users count
user_route.get("/total-users", getAllUsersCount);

//Get User Profile
user_route.get("/profile/:id", getUserProfile);

//Change User status (isActive)
user_route.patch('/update-status/:id', updateUserStatus);

//Delete User permanently
user_route.delete("/delete/:id", deleteUser)

//Search User
user_route.get("/search-user", getSearchedUsers)

user_route.post("/login", loginUser);

// secured routes -------------------------------
user_route.post("/logout", verifyJWT, logoutUser)

// Refresh Access Token
user_route.post("/refresh-token", refreshAccessToken);

//Change Password
user_route.post("/change-password", verifyJWT, changeCurrentUserPassword);

//Change Avatar
user_route.patch("/change-avatar", verifyJWT, upload('products').single("avatar"), updateUserAvatar);

//Reset Password
user_route.put("/reset-password/:reset_token", resetPassword);
export default user_route;  
