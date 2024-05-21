import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken";
import fs from "fs";
import  {sendEmail}  from "../utils/send.email.js";
import path  from 'path';

// Import the email content object from the specified file for email content access
import {
  emailContentInfo,
} from "../utils/emailTemplates/welcomeEmail.js";
import { Product } from "../models/product.model.js";
import { Contact } from "../models/contact.model.js";
import { ProductCategory } from "../models/product.category.model.js";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
import { Role } from "../models/role.model.js";


//Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong, while generating refresh and access token" );
  }
};

//Register User
const registerUser = async (userDetails, avatarLocalPath) => {
  //TODO: Register a new User
  const { username, fullName, email, password, roleId } = userDetails;
  //const sentEmail = await sendEmail();
  //console.log("@@@@@@@ ", sentEmail );

  if (!avatarLocalPath.length) {
    throw new apiError(400, "avatar file is required");
  }

  if ([username, fullName, email, password, roleId].some((field) => field?.trim() === ""))
  {
    throw new apiError(400, "All fields are required"); 
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  
  if (existingUser) {
    if (existingUser.username === username) {
      throw new apiError(409, "Username already exists.");
    } else if (existingUser.email === email) {
      throw new apiError(409, "Email already exists.");
    }
  }

  const user = await User.create({
    fullName,
    avatar: avatarLocalPath,
    email,
    password,
    username: username.toLowerCase(),
    roleId
  });

  console.log("created user:---", user);
  if (!user) {
    fs.unlink(avatarLocalPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
    });
    throw new apiError(500, "Something went wrong while registering the user");
  }

  //Sending the email to User.
  return user;
};

//Update User info
const updateUserProfile = async (userDetails, UserId, userAvatarLocalPath) =>{
  // TODO: Update User - FullName, Email and Avatar, 
  // Ensure userDetails is provided and is an object

  if (!userDetails || typeof userDetails !== "object") {
    throw new apiError(400, "Invalid user details"); 
  }

  // Validate UserId
  if (!isValidObjectId(UserId)) {
    throw new apiError(400, "Invalid user ID"); 
  }

  // Find the user by ID
  const user = await User.findOne({_id: UserId, isActive: true});

  if (!user) {
    throw new apiError(404, "User not Found"); 
  }

  // Update user's fullName if provided
  if (userDetails.fullName && userDetails.fullName.trim() !== "") {
    user.fullName = userDetails.fullName.trim();
  }

  // Update user's email if provided
  if (userDetails.email && userDetails.email.trim() !== "") {
    user.email = userDetails.email;
  }

  let updateUser;

  console.log("userAvatarLocalPath: ", userAvatarLocalPath);

  if (userAvatarLocalPath?.length > 0) {
  const uploadUserAvatar = await uploadOnCloudinary(userAvatarLocalPath, "User");
  const deleteUserAvatar = await deleteOnCloudinary(user.avatar?.public_id, "image");
  if (uploadUserAvatar.length > 0) {
    user.avatar =  {url:uploadUserAvatar[0].url,public_id:uploadUserAvatar[0].public_id};
    }else{
      throw new apiError(404, "User avatar not found")
    };
    updateUser = await User.updateOne(
      {_id:UserId},
      {
        $set: {
        ...user
        },
      }
    );

    return new apiResponse(200, user, "User updated successfully.");
  }else{
    // Save the updated user
    updateUser = await user.save();
    if (!updateUser) {
      throw new apiError(500, "Failed to update User, try again")
    }
    return updateUser
  }
};

//Get All User's Count
const getAllUsersCount = async () => {
  //TODO: Get All Users Count
  const totalUsers = await User.countDocuments();
  console.log("User Count: ", totalUsers);
  if (!totalUsers) {
    throw new apiError(404, "No users found");
  }

  return totalUsers;
};

// Get User Profile
const getUserProfile = async (userId) => {
  //TODO: Get User Profile

  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid userId"); 
  }

  if (!userId?.trim()) {
    throw new apiError(400, "UserId is missing"); 
  }

  const user = await User.findOne({ _id: userId }).select("-password");
  
  if (!user) {
    throw new apiError(400, "User not found"); 
  }else{
    return user
  }
};

//Update User Status
const updateUserStatus = async (body, userId) => {
  //TODO: Update User Status
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid UserId"); 
  }
  const user = await User.findById(userId);
  
  if (!user) {    
    throw new apiError(400, "User not found"); 
  }

  // Update the video with new title and description
  const updatedUserStatus = await User.updateOne(
    { _id: userId },
    {
      $set: { isActive: body.isActive },
    },
    {
      new: true,
    }
  );

  if (!updatedUserStatus) {
    throw new apiError(400, "Status could not be changed"); 
  }else{
    return {
      _id:userId,
      isActive: body.isActive
    }
  }
};

//Delete User 
const deleteUser = async (userId) => {
  //TODO: Delete User
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid userId"); 
  }

  const findUser = await User.findById({ _id: userId });
  if (!findUser) {
    throw new apiError(400, "User not found"); 
  }
  

  const deletedUser = await User.findByIdAndDelete(userId);
  
  if(!deletedUser){
    throw new apiError(400, "User could not be deleted"); 
  }

  return deletedUser
};

//Get Searched Users
const getSearchedUsers = async (query) => {
  const condition = {};
  
  // Check if the 'query' object is not empty
  if (Object.keys(query).length !== 0) {
   // Check if 'search' key exists in 'query' object
   if ("username" in query) {
    condition.username = { $regex: query.username, $options: "i" };
    }
    if ("fullName" in query) {
      condition.fullName = { $regex: query.fullName, $options: "i" };
    }
  }
  console.log("condition: ", condition);
  const users = await User.find(condition);
  return users;
};

//Login User
const loginUser = async (loginDetails) => {
  //TODO
  // req.body - data
  //username or email exists
  //find the user
  //check password
  //access & refresh token generation
  //send tokens in secure cookies

  const { email, username, password } = loginDetails;

  if (!(username || email)) {
    throw new apiError(400, "Username or email is required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return {
    loggedInUser,
    accessToken,
    refreshToken,
  };
};

//Logout User
const logoutUser = async (userId) => {
  //TODO: Logout User
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid userId"); 
  }
  const logoutUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
      // $unset: {
      //   refreshToken: 1, //this remove the field from document
      // },
    },
    {
      new: true,
    }
  );

  if(!logoutUser){
    throw new apiError(400, "User could not logout"); 
  }
  return logoutUser;
};

//Refresh Access Token
const refreshAccessToken = async (incomingRefreshToken) => {
//TODO: Refresh Access Token  

//If incomingRefreshToken not authorized, throw error
if (!incomingRefreshToken) {
  throw new apiError(401, "unauthorized request");
}

try {
  const decodedToken = Jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_KEY
  );

  const user = await User.findById(decodedToken?._id);

  console.log("user: ", user);

  //If User not found, throw error
  if (!user) {
    throw new apiError(401, "Invalid refresh token");
  }

  console.log("-----", incomingRefreshToken, user?.refreshToken);
//Compare incoming and exiting refreshToken, if not matched, throw error
  if (incomingRefreshToken !== user?.refreshToken) {
    throw new apiError(401, "Refresh Token is Expired or used");
  }

  const { accessToken, newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);
    
    return {accessToken, newRefreshToken};
  }catch(error){
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
};

//Change User Password
const changeCurrentUserPassword = async (userId, oldPassword, newPassword) =>{
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid userId"); 
  }

  // Find user by userId
  const user = await User.findById(userId);

  // If user not found, throw error
  if(!user){
    throw new apiError(400, "User not found"); 
  }

  // Check if old password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  // If old password is incorrect, throw error
  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

return user;
};

//Update User's Avatar
const updateUserAvatar = async(userId, avatarLocalPath) =>{
  // If userId is not valid Object, throw error
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid userId"); 
  }

  const user = await User.findById({_id:userId});

// If user not found, throw error
  if(!user) {
    throw new apiError(400, "User not found");
  };

  // If Avatar not found, throw error
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  // If Avatar not uploaded on Cloudinary, throw error
  const avatar = await uploadOnCloudinary(avatarLocalPath, "User");
  //If cloudinary did not return avatar's url, throw error
  if (!avatar.length) {
    throw new apiError(400, "Error while uploading avatar image");
  }

  //Update old Avatar with new one

  const updatedAvatar = await user.set({avatar: avatar}).save();

  console.log("updatedAvatar: ", updatedAvatar);

  //If Avatar not updated, throw error
  if(!updatedAvatar){
    throw new apiError(400, "Avatar Image could not upload successfully");
  }
  await deleteOnCloudinary(user.avatar[0].public_id, "image");  
  
  return updatedAvatar;
};

// Reset Password
const resetPassword = async (reset_token, newPassword) => {
  console.log("paramsData", reset_token);
  // Disable pre-hook
  User.disablePreSaveHook();

  let decodedToken;
  try {
     // Verify the reset token
     decodedToken = Jwt.verify(reset_token, process.env.RESET_TOKEN_KEY);
     console.log("decodedToken", decodedToken); 
   } catch (error) {
     // Handle token verification errors
     if (error instanceof Jwt.TokenExpiredError) {
       throw new Error("Reset token has expired");
     } else if (error instanceof Jwt.JsonWebTokenError) {
       throw new Error("Invalid reset token");
     }
   }

  // Ensure that the token was decoded successfully
  if (!decodedToken || !decodedToken._id) {
    throw new Error("Invalid reset token");
  }

  // Find the user by ID from decoded token
  const user = await User.findById(decodedToken._id);
  console.log("user found", user);
  if (!user) {
    throw new apiError(400, "User not found")
  }

  if(!newPassword) {
    throw new apiError(400, "New password is required")
  }

  const validatePasswordCheck = validatePassword(newPassword);
  if(!validatePasswordCheck) {
    throw new apiError(400, "One digit small, capital letter & must be special characters")
  }
  // Update the user's password
    console.log("inside if", user.password);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

  // Enable pre-hook
  User.enablePreSaveHook();
  
  return null;
}

// Forgot Password
const forgetPassword = async (forgetDetails) => {
  //TODO: Forgot Password
  const { email } = forgetDetails;

  if (!email) {
    throw new apiError(400, "Email is required"); 
  }

  const user = await User.findOne({email: email});
  console.log("user", user);
  if (!user) {
    throw new apiError(404, "User does not exists"); 
  }

  const resetToken = await user.getResetToken();
  console.log("reset token", resetToken);

  const subject = `World Class Gourmet Foods Reset Password`
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

  const resetMessageAndLink = `Click on the link to reset your password. ${resetUrl}. If you 
  have not request then ignore it`

  // send token via email
  await sendEmail(user.email, subject, resetMessageAndLink)

  return { resetMessageAndLink }
}

// Dashboard
const fetchDashboard = async () => {

  try {
    const user = await User.countDocuments();
    const roles = await Role.countDocuments();
    const product = await Product.countDocuments();
    const contacts = await Contact.countDocuments();
    const productCategory = await ProductCategory.countDocuments();
    const productSubCategory = await ProductSubCategory.countDocuments();

    return {
      user,
      roles,
      product,
      contacts,
      productCategory,
      productSubCategory
    }

  } catch (error) {
    
  }
  
}


//Get All User's list
const fetchAllUsers = async () => {
  //TODO: Get All Users Count
  const users = await User.find();
  if (!users.length) {
    throw new apiError(404, "No users found");
  }

  return users;
};

export default {
  registerUser,
  updateUserProfile,
  getAllUsersCount,
  getUserProfile,
  updateUserStatus,
  deleteUser,
  getSearchedUsers,
  loginUser, 
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  updateUserAvatar,
  resetPassword,
  forgetPassword,
  fetchDashboard,
  fetchAllUsers
}
