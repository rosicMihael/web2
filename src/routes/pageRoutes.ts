import express from "express";
import {
  getAllPassesPage,
  getHome,
  getPrivate,
  logout,
  signUp,
} from "../controllers/homeController.ts";
import oidc from "express-openid-connect";
const { requiresAuth } = oidc;

const router = express.Router();

router.get("/", getHome);
router.get("/private", requiresAuth(), getPrivate);
router.get("/passes", requiresAuth(), getAllPassesPage);
router.post("/logout", requiresAuth(), logout);
router.get("/sign-up", signUp);

export default router;
