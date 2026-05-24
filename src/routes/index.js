import express from 'express';
import authRoutes from './auth/authRoutes.js';
import profileRoutes from './common/profileRoutes.js';
import vendorProfileRoutes from './vendor/vendorProfileRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/vendor/profile', vendorProfileRoutes);

export default router;
