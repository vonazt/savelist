import express from 'express';
import { authController } from '../controllers';
const router = express.Router();

router.get('/login', authController.login);

router.get('/callback', authController.callback);

router.post('/refresh_token', authController.refresh);

export default router;
