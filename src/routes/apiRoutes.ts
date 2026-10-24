import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { getPass, createPass, deletePass, cancelPass } from "../controllers/passController.ts";
import oidc from "express-openid-connect";
const { requiresAuth } = oidc;

const router = express.Router();

router.get("/passes/:id", requiredScopes("read:passes"), getPass);
router.post("/passes", requiredScopes("create:passes"), createPass);
router.post('/passes/:id/cancel', requiresAuth(), cancelPass);
router.post('/passes/:id/delete', requiresAuth(), deletePass);

export default router;
