import express from 'express';
import VendorCategoryController from '#controllers/vendor/categoryController.js';
import authMiddleware from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', authMiddleware, VendorCategoryController.getCategories);

export default router;
