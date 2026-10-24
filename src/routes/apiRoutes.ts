import express from 'express';
import { logout, signUp } from '../controllers/apiController.ts';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

router.post('/logout', requiresAuth(), logout);
router.get('/sign-up', signUp);

export default router;