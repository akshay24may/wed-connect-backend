import express from 'express';
import VendorCategoryController from '#controllers/vendor/categoryController.js';
import { authenticate, isVendor } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', authenticate, isVendor, VendorCategoryController.getCategories);

export default router;
