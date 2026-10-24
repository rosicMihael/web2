import express from 'express';
import { getHome, getPrivate,  } from '../controllers/homeController.ts';
import oidc from 'express-openid-connect';
const { requiresAuth } = oidc;

const router = express.Router();

router.get('/', getHome);
router.get('/private', requiresAuth(), getPrivate);

export default router;