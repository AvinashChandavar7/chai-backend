import jwt from "jsonwebtoken";

import { User } from "../models/user.model";

import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"


const secretKey = process.env.ACCESS_TOKEN_SECRET;

export const verifyJWT = asyncHandler(
  async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken
        || req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(token, secretKey);

      if (!decodedToken) {
        throw new ApiError(401, "Invalid decoded Token");
      }

      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

      if (!user) {
        throw new ApiError(401, "Invalid Access Token"); // discuss about frontend
      }

      req.user = user;

      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  }
);