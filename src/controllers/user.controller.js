import userService from "../services/user.service.js"
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register User
const registerUser = asyncHandler(async (req, res) => {
  //TODO: Register a new User

  try {
    // Extract user details like fullName, email
    const userDetails = req.body;
    
    // Extract avatarLocalPath
    const avatarLocalPath = req.files[0].path;

    // Register the user with the provided data
    const userResponse = await userService.registerUser(
      userDetails,
      avatarLocalPath
    );

    return res
      .status(201).json(
        new apiResponse(201, userResponse, "User registered Successfully."));
  } catch (error) {
    // Check if the error is due to undefined properties and handle it accordingly
    if (error.message.includes("Cannot read properties of undefined")) {
      return res
        .status(400).json(
          new apiError({ message: "Invalid request. Please provide files." }));
    }
    // Handle errors and return an appropriate error response
    return res
      .status(500)
      .json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Update User Info
const updateUserProfile = asyncHandler(async (req, res) => {
  //TODO: Update User information
  let response;
  try {
    const { body, params, files } = req;
    const response = files?.avatar
      ? await userService.updateUserInfo(body, params.id, files.avatar)
      : await userService.updateUserInfo(body, params.id);
    return res
      .status(200).json(
        new apiResponse(200, response, "User's info updated successfully", true));
  } catch (error) {
    // Send error response if any error occurs
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Get All Users
const getAllUsersCount = asyncHandler(async (req, res) => {
  //TODO: Get all Users from the DB
  try {
    const response = await userService.getAllUsersCount();
    return res
      .status(200)
      .json(new apiResponse(200, response, "All users fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { params } = req;
  try {
    const userProfileResponse = await userService.getUserProfile(params.id);
    console.log("userProfileResponse: ", userProfileResponse);
    return res
      .status(200).json(
        new apiResponse(200, userProfileResponse, "User Profile fetched successfully"));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Get All Users
const updateUserStatus = asyncHandler(async (req, res) => {
  //TODO: Get all Users from the DB
  
  const { body, params } = req;
  try {
    const response = await userService.updateUserStatus(body, params.id);
    return res
      .status(200)
      .json(new apiResponse(200, response, "User status updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Delete User
const deleteUser = asyncHandler(async (req, res) => {
  //TODO: Delete User from the DB
  
  const { params } = req;
  try {
    const response = await userService.deleteUser(params.id);
    return res
      .status(200)
      .json(new apiResponse(200, response, "User deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Get searched User
const getSearchedUsers = asyncHandler(async (req, res) => {
  //TODO: Get Searched User
  try {
    const allUserResponse = await userService.getSearchedUsers(req.query);
    if(allUserResponse.length){
      return res.status(200)
      .json(
        new apiResponse(200, allUserResponse, "User searched successfully"));
    }else{
      return res.status(401)
      .json(
        new apiResponse(401, allUserResponse, "User not found"));
    }
    
  } catch (error) {
    return res.status(500)
      .json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  //TODO: Login User
  // req.body - data
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
  //TODO: Logout User
  try {
    await userService.logoutUser(req.user._id);

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json(new apiResponse(200, {}, "User logged Out"));
  } catch (error) {
    return res.status(500)
      .json(new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  //TODO: Refresh Access Token
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
    
    return res.status(200)
    .json(new apiResponse(200, response, "Password changed successfully"));
  } catch (error) {
    return res.status(500)
      .json(new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Update user avatar
const updateUserAvatar = asyncHandler(async(req, res)=>{
  //TODO: Change user's avatar/pic
  const { userId } = req.body;
  
  try {
    const response = await userService.updateUserAvatar(userId, req.file);
    
    return res.status(200)
    .json(new apiResponse(200, response, "Avatar Image uploaded successfully"));
  } catch (error) {
    return res.status(500)
      .json(new apiError({ statusCode: error.statusCode, message: error.message })
      );
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
  updateUserAvatar
};
