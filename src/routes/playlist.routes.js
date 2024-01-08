import { Router } from "express";

import { } from "../controllers/playlist.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";




const router = Router();
router.use(verifyJWT);


export default router;
