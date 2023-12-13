### Logic building | Log out controller ([link here](https://www.youtube.com/watch?v=7DVpag3cO0g))

```js
import { Router } from "express";
import { logoutUser } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//! secured route
router.post("/logout", verifyJWT, logoutUser);

export default router;
```

```js
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const secretKey = process.env.ACCESS_TOKEN_SECRET;

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new ApiError(401, "Invalid decoded Token");
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token"); // discuss about frontend
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
```

```js
const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const loggedOutUser = await User.findByIdAndUpdate(
    id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        { loggedOutUser },
        { message: "User successfully logout" }
      )
    );
});
```
