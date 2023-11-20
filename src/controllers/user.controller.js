import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "successfully register" });
});


const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "successfully login" });
});


export { registerUser, loginUser };