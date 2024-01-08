import { Router } from "express";

import { } from "../controllers/subscription.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();
router.use(verifyJWT);

export default router;
