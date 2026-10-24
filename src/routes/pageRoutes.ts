import express from 'express';
import { getHome, getPrivate,  } from '../controllers/homeController.ts';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

router.get('/', getHome);
router.get('/private', requiresAuth(), getPrivate);

export default router;