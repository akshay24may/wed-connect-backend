import express from 'express';
import AuthController from '#controllers/auth/authController.js';
import GoogleAuthController from '#controllers/auth/googleAuthController.js';
import { authenticate } from '#middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/google', GoogleAuthController.initiateGoogleAuth);

router.get('/google/callback', GoogleAuthController.handleGoogleCallback);

router.post('/refresh', AuthController.refreshToken);

router.post('/logout', authenticate, AuthController.logout);

router.post('/otp/request', AuthController.requestOtp);

router.post('/otp/verify', AuthController.verifyOtp);

router.post('/password/reset', AuthController.resetPassword);

export default router;
