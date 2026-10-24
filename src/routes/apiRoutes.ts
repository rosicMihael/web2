import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { getPass, createPass } from "../controllers/passController.ts";

const router = express.Router();

router.get("passes/:id", requiredScopes("read:passes"), getPass);
router.post("passes", requiredScopes("create:passes"), createPass);

export default router;
