import express from "express";
import {
  getBrokenAuth,
  getHome,
  getSqlInjection
} from "../controllers/homeController.ts";

const router = express.Router();

router.get("/", getHome);
router.get("/sql_injection", getSqlInjection);
router.get("/broken_auth", getBrokenAuth);

export default router;
