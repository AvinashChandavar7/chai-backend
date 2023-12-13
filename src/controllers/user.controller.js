import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { User } from "../models/user.model.js"


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.refreshAccessToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false }); //  validateBeforeSave is false because of password required

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
};


/**
 * !) Register User
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
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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

/**
 * !) Login User
 * ?1) Get user Details from Frontend (Postman) 
 * ?-)   req.body => data => [ username or email ]
 * ?2) find user by username or email exist or not.
 * ?3)  check if user password is correct or not.
 * ?4) check access and refresh token.
 * ?5) send inside the  cookies
 */

const loginUser = asyncHandler(async (req, res) => {

  const { email, username, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  if (!accessToken && !refreshToken) {
    throw new ApiError(401, "something went wrong while creating token");
  }

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


  const options = { httpOnly: true, secure: true };



  return res.status(200)
    .cookies("accessToken", accessToken, options)
    .cookies("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,
      { user: loggedInUser, accessToken, refreshToken },
      { message: "User successfully login" }),
    );
});


/**
 * !)  Logout User
 * ?1) 
 */

const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const loggedOutUser = await User.findByIdAndUpdate(id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { loggedOutUser }, { message: "User successfully logout" }),);

});



export { registerUser, loginUser, logoutUser };


