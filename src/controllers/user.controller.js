import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


/**
 * ?1) Get user Details from Frontend (Postman).
 * ?2) Validation - Not Empty.
 * ?3) Check if user already exists : email, username
 * ?4) Check if user have Images, Avatar
 * ?5) Upload them to Cloudinary, Avatar (Multer is working or not).
 * ?6) Create user object - Create entry in Database.
 * ?7) Remove password and refresh token field from response and  Check for user Creation.
 * ?8) return response.
 */

const registerUser = asyncHandler(async (req, res) => {

  const { fullName, username, email, password } = req.body;

  if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field is required")
  }

  const exitedUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (exitedUser) {
    throw new ApiError(409, "User with email or username already exited")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  if (!user) {
    throw new ApiError(400, "Invalid user")
  }

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "successfully login" });
});


export { registerUser, loginUser };



/***************************************************************
 * * step 1 Get user Details from Frontend (Postman).
 * const registerUser = asyncHandler(async (req, res) => {
 *   res.status(200).json({ message: "successfully register" });
 * });
 * 
 * const loginUser = asyncHandler(async (req, res) => {
 *   res.status(200).json({ message: "successfully login" });
 * });
 *************************************************************/
/***************************************************************
 *  * step 2 Validation - Not Empty.
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 *
 * if (fullName) {
 *   throw new ApiError(400, "fullName is required")
 * }
 *  
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 * return res.status(200).json({ message: "successfully" });
 * });
 * 
 *************************************************************/
/***************************************************************
 *  * step 3 Check if user already exists : email, username
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 * 
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 *  const exitedUser = await User.findOne({
 *    $or: [{ email }, { username }]
 *  });
 *
 *  if (exitedUser) {
 *    throw new ApiError(409, "User with email or username already exited")
 *  }
 * 
 * return res.status(200).json({ message: "successfully" });
 * });
 * 
 *************************************************************/
/***************************************************************
 *  * step 4 Check if user have Images, Avatar
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 * 
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 *  const exitedUser = await User.findOne({
 *    $or: [{ email }, { username }]
 *  });
 *
 *  if (exitedUser) {
 *    throw new ApiError(409, "User with email or username already exited")
 *  }
 * 
 * 
 *  const avatarLocalPath = req.files?.avatar[0]?.path;
 *  const coverImageLocalPath = req.files?.coverImage[0]?.path;
 * 
 *  if (!avatarLocalPath) {
 *    throw new ApiError(400, "Avatar file is required")
 *  }
 * 
 * 
 * return res.status(200).json({ message: "successfully" });
 * });
 * 
 *************************************************************/
/***************************************************************
 *  * step 5 Upload them to Cloudinary, Avatar (Multer is working or not).
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 * 
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 *  const exitedUser = await User.findOne({
 *    $or: [{ email }, { username }]
 *  });
 *
 *  if (exitedUser) {
 *    throw new ApiError(409, "User with email or username already exited")
 *  }
 * 
 * 
 *  const avatarLocalPath = req.files?.avatar[0]?.path;
 *  const coverImageLocalPath = req.files?.coverImage[0]?.path;
 * 
 *  if (!avatarLocalPath) {
 *    throw new ApiError(400, "Avatar file is required")
 *  }
 * 
 * const avatar = await uploadOnCloudinary(avatarLocalPath);
 * const coverImage = await uploadOnCloudinary(coverImageLocalPath);
 * 
 * if (!avatar) {
 *   throw new ApiError(400, "Avatar file is required")
 * }
 * return res.status(200).json({ message: "successfully" });
 * });
 * 
 *************************************************************/
/***************************************************************
 *  * step 6 Create user object - Create entry in Database.
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 * 
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 *  const exitedUser = await User.findOne({
 *    $or: [{ email }, { username }]
 *  });
 *
 *  if (exitedUser) {
 *    throw new ApiError(409, "User with email or username already exited")
 *  }
 * 
 * 
 *  const avatarLocalPath = req.files?.avatar[0]?.path;
 *  const coverImageLocalPath = req.files?.coverImage[0]?.path;
 * 
 *  if (!avatarLocalPath) {
 *    throw new ApiError(400, "Avatar file is required")
 *  }
 * 
 * const avatar = await uploadOnCloudinary(avatarLocalPath);
 * const coverImage = await uploadOnCloudinary(coverImageLocalPath);
 * 
 * if (!avatar) {
 *   throw new ApiError(400, "Avatar file is required")
 * }
 * 
 * const user = await User.create({
 *    fullName,
 *    email,
 *    password,
 *    username: username.toLowerCase(),
 *    avatar: avatar.url,
 *    coverImage: coverImage?.url || "",
 *  });
 *
 *  if (!user) {
 *    throw new ApiError(400, "Invalid user")
 *  }
 * 
 * return res.status(200).json({ message: "successfully" });
 * });
 * 
 *************************************************************/

/***************************************************************
 *  * step 7  Remove password and refresh token field from response and  Check for user Creation.
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 * 
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 *  const exitedUser = await User.findOne({
 *    $or: [{ email }, { username }]
 *  });
 *
 *  if (exitedUser) {
 *    throw new ApiError(409, "User with email or username already exited")
 *  }
 * 
 * 
 *  const avatarLocalPath = req.files?.avatar[0]?.path;
 *  const coverImageLocalPath = req.files?.coverImage[0]?.path;
 * 
 *  if (!avatarLocalPath) {
 *    throw new ApiError(400, "Avatar file is required")
 *  }
 * 
 * const avatar = await uploadOnCloudinary(avatarLocalPath);
 * const coverImage = await uploadOnCloudinary(coverImageLocalPath);
 * 
 * if (!avatar) {
 *   throw new ApiError(400, "Avatar file is required")
 * }
 * const user = await User.create({
 *    fullName,
 *    email,
 *    password,
 *    username: username.toLowerCase(),
 *    avatar: avatar.url,
 *    coverImage: coverImage?.url || "",
 *  });
 *
 *  if (!user) {
 *    throw new ApiError(400, "Invalid user")
 *  }
 *
 *  const createdUser = await User.findById(user._id).select("-password -refreshToken");
 *
 *  if (!createdUser) {
 *    throw new ApiError(500, "Something went wrong while registering the user");
 *  }
 * 
 * return res.status(200).json({ message: "successfully" });
 * });
 * 
 *************************************************************/
/***************************************************************
 *  * step 8 Returning the response
 * const registerUser = asyncHandler(async (req, res) => {
 *    const { fullName, username, email, password } = req.body;
 * 
 * if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
 *   throw new ApiError(400, "All field is required")
 * }
 * 
 *  const exitedUser = await User.findOne({
 *    $or: [{ email }, { username }]
 *  });
 *
 *  if (exitedUser) {
 *    throw new ApiError(409, "User with email or username already exited")
 *  }
 * 
 * 
 *  const avatarLocalPath = req.files?.avatar[0]?.path;
 *  const coverImageLocalPath = req.files?.coverImage[0]?.path;
 * 
 *  if (!avatarLocalPath) {
 *    throw new ApiError(400, "Avatar file is required")
 *  }
 * 
 * const avatar = await uploadOnCloudinary(avatarLocalPath);
 * const coverImage = await uploadOnCloudinary(coverImageLocalPath);
 * 
 * if (!avatar) {
 *   throw new ApiError(400, "Avatar file is required")
 * }
 * const user = await User.create({
 *    fullName,
 *    email,
 *    password,
 *    username: username.toLowerCase(),
 *    avatar: avatar.url,
 *    coverImage: coverImage?.url || "",
 *  });
 *
 *  if (!user) {
 *    throw new ApiError(400, "Invalid user")
 *  }
 *
 *  const createdUser = await User.findById(user._id).select("-password -refreshToken");
 *
 *  if (!createdUser) {
 *    throw new ApiError(500, "Something went wrong while registering the user");
 *  }
 * 
 *  return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
 * });
 * 
 *************************************************************/