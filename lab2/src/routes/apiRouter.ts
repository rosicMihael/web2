import express from "express";
import { login } from "../controllers/authController.ts";
import { authRateLimiter } from "../middleware/leakyBucket.ts";

const router = express.Router();

router.post("/login", authRateLimiter, login);

export default router;