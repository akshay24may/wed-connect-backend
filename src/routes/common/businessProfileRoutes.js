import express from 'express';
import BusinessProfileController from '#controllers/common/businessProfileController.js';
import { authenticate } from '#middleware/authMiddleware.js';
import { uploadBusinessMedia } from '#uploads/uploadMiddleware.js';

const router = express.Router();

router.get('/', authenticate, BusinessProfileController.getBusinessProfiles);

router.get('/:businessId', authenticate, BusinessProfileController.getBusinessProfile);

router.post('/', authenticate, BusinessProfileController.createBusinessProfile);

router.put('/:businessId', authenticate, BusinessProfileController.updateBusinessProfile);

router.delete('/:businessId', authenticate, BusinessProfileController.deleteBusinessProfile);

router.post('/:businessId/media', authenticate, uploadBusinessMedia, BusinessProfileController.uploadBusinessMedia);

export default router;
