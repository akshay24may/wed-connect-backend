import express from 'express';
import VendorProfileController from '#controllers/vendor/vendorProfileController.js';
import { authenticate, isVendor } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, isVendor, VendorProfileController.getVendorProfile);

router.put('/', authenticate, isVendor, VendorProfileController.updateVendorProfile);

router.post('/logo', authenticate, isVendor, VendorProfileController.uploadBusinessLogo);

router.post('/banner', authenticate, isVendor, VendorProfileController.uploadBusinessBanner);

router.delete('/logo', authenticate, isVendor, VendorProfileController.deleteBusinessLogo);

router.delete('/banner', authenticate, isVendor, VendorProfileController.deleteBusinessBanner);

export default router;
