import userService from "../services/user.service.js"
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

//Register User
const registerUser = asyncHandler(async (req, res) => {
  try {
    const userDetails = req.body;
    const avatarLocalPath = req.files[0].path;
    
    if (!avatarLocalPath) {
      return res.status(400).json(new apiError({ message: "Invalid request. Please provide files." }));
    }
    const userResponse = await userService.registerUser(userDetails, avatarLocalPath);
    return res.status(201).json(new apiResponse(201, userResponse, "User registered successfully."));
  } catch (error) {
    return res.status(500).json(new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Update User Info
const updateUserProfile = asyncHandler(async (req, res) => {
  //TODO: Update User information
  let response;
  try {
    const { body, params, files } = req;
    const response = files?.avatar
      ? await userService.updateUserInfo(body, params.id, files?.avatar)
      : await userService.updateUserInfo(body, params.id);
      return handleResponse(res, 202, response, "User's info updated successfully");
    } catch (error) {
      return handleError(res, error);
    }
});

//Get All Users
const getAllUsersCount = asyncHandler(async (req, res) => {
  //TODO: Get all Users from the DB
  try {
    const response = await userService.getAllUsersCount();
    return handleResponse(res, 200, response, "Users count got successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { params } = req;
  try {
    const response = await userService.getUserProfile(params.id);
    console.log("userProfileResponse: ", response);
    return handleResponse(res, 200, response, "Users profile fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get All Users
const updateUserStatus = asyncHandler(async (req, res) => {
  //TODO: Get all Users from the DB
  
  const { body, params } = req;
  try {
    const response = await userService.updateUserStatus(body, params.id);
    return handleResponse(res, 202, response, "User's status updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete User
const deleteUser = asyncHandler(async (req, res) => {
  //TODO: Delete User from the DB
  
  const { params } = req;
  try {
    const response = await userService.deleteUser(params.id);
    return handleResponse(res, 200, response, "User deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get searched User
const getSearchedUsers = asyncHandler(async (req, res) => {
  //TODO: Get Searched User
  try {
    const allUserResponse = await userService.getSearchedUsers(req.query);
    if(allUserResponse.length){
      return handleResponse(res, 202, response, "User searched successfully");
    }else{
      return handleResponse(res, 202, response, "User not found");
    }
    
  } catch (error) {
    return handleError(res, error);
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { loggedInUser, accessToken, refreshToken } =  await userService.loginUser(req.body);

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
        .status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in Successfully"));
  } catch (error) {
    return res.status(500)
      .json(new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Logout User
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await userService.logoutUser(req.user._id);
    const options = {httpOnly: true, secure: true};
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    return handleResponse(res, 200, {}, "User logged out successfully");
  } catch (error) {
    return handleError(res, error);
  }

});

//Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  console.log("incomingRefreshToken: ---", incomingRefreshToken);
  try {
    const {accessToken, newRefreshToken} = await userService.refreshAccessToken(incomingRefreshToken);

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };
    
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new apiResponse(200, {}, "Access Token refreshed"));
  } catch (error) {
    return res.status(500)
      .json(new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Change current User's Password
const changeCurrentUserPassword = asyncHandler(async(req, res)=>{
  //TODO: Handle the reset password response.
  
  const { userId, oldPassword, newPassword } = req.body;

  const validatePassword = (password) => {
    // Define the regex pattern for password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[^\w\d\s]).{6,}$/;

    // Test the password against the regex pattern
    return passwordRegex.test(password);
  };

  if (!validatePassword(newPassword)) {
    return res.status(401)
    .json(new apiError(401, {}, `Password '${newPassword}' is invalid`));
  }

  try {
    const response = await userService.changeCurrentUserPassword(userId, oldPassword, newPassword);
    return handleResponse(res, 200, response, "Password changed successfully");
  } catch (error) {
    return handleError(res, error);
  }
  
});

//Update user avatar
const updateUserAvatar = asyncHandler(async(req, res)=>{
  //TODO: Change user's avatar/pic
  const { userId } = req.body;
  
  try {
    const response = await userService.updateUserAvatar(userId, req.file);
    return handleResponse(res, 202, response, "Avatar Image uploaded successfully");
  } catch (error) {
    return handleError(res, error);
  }

});

// Reset the user password
const resetPassword = asyncHandler( async (req, res) => {
  //TODO: Reset user's password
  try {
    const response = await userService.resetPassword(req.params.reset_token, req.body.newPassword);
    return handleResponse(res, 202, response, "Password has been reset successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

// Forget the user password
const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const response = await userService.forgetPassword(req.body); 
    return handleResponse(res, 202, response, "Link has been sent in your email");
  } catch (error) {
    return handleError(res, error);
  }
});

// dashboard
const fetchDashboard = asyncHandler( async (req, res) => {
  //TODO: Reset user's password
  try {
    const response = await userService.fetchDashboard();
    return handleResponse(res, 200, response, "fetch successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get All Users
const fetchAllUsers = asyncHandler(async (req, res) => {
  //TODO: Get all Users from the DB
  try {
    const response = await userService.fetchAllUsers();
    return handleResponse(res, 200, response, "Users fetch successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export {
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
};
