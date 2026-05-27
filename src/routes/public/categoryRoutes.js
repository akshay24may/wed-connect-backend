import express from 'express';
import PublicCategoryController from '#controllers/public/categoryController.js';

const router = express.Router();

router.get('/categories', PublicCategoryController.getCategories);

export default router;
