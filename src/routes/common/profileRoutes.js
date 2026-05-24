import express from 'express';
import ProfileController from '#controllers/common/profileController.js';
import { authenticate } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, ProfileController.getProfile);

router.put('/', authenticate, ProfileController.updateProfile);

router.post('/photo', authenticate, ProfileController.uploadProfilePhoto);

router.post('/avatar', authenticate, ProfileController.uploadAvatarPhoto);

router.delete('/photo', authenticate, ProfileController.deleteProfilePhoto);

router.post('/password/change', authenticate, ProfileController.changePassword);

export default router;
