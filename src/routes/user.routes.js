import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controller.js";

import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  registerUser
);

router.post("/login", loginUser);

//! secured route
router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/change-password", verifyJWT, changeCurrentPassword);

router.get("/current-user", verifyJWT, getCurrentUser);

router.patch("/update-account", verifyJWT, updateAccountDetails);

router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

router.patch("/cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.get("/channel/:username", verifyJWT, getUserChannelProfile,);

router.get("/history", verifyJWT, getWatchHistory);

export default router;


// router.route("/register").post(registerUser);
// router.route("/login").post(loginUser);