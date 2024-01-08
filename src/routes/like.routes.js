import { Router } from "express";

import { } from "../controllers/like.controller.js"


import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();
router.use(verifyJWT);

export default router;
