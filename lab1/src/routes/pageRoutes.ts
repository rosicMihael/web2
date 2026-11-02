import express from "express";
import {
  getAllPassesPage,
  getHome,
  getPrivate,
  getPassInfoPage,
  logout,
  signUp,
} from "../controllers/homeController.ts";
import { cancelPass, deletePass } from "../controllers/passController.ts";
import oidc from "express-openid-connect";
const { requiresAuth } = oidc;

const router = express.Router();

router.get("/", getHome);
router.get("/private", requiresAuth(), getPrivate);
router.get("/passes", requiresAuth(), getAllPassesPage);
router.post('/passes/:id/cancel', requiresAuth(), cancelPass);
router.post('/passes/:id/delete', requiresAuth(), deletePass);
router.get("/info/:id", getPassInfoPage);
router.post("/logout", requiresAuth(), logout);
router.get("/sign-up", signUp);

export default router;
