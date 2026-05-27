import express from 'express';
import CategoryController from '#controllers/panel/categoryController.js';
import authMiddleware from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', authMiddleware, CategoryController.getCategories);

router.get('/categories/:categoryId', authMiddleware, CategoryController.getCategory);

router.post('/categories', authMiddleware, CategoryController.createCategory);

router.put('/categories/:categoryId', authMiddleware, CategoryController.updateCategory);

router.delete('/categories/:categoryId', authMiddleware, CategoryController.deleteCategory);

router.patch('/categories/status/:categoryId', authMiddleware, CategoryController.toggleStatus);

router.patch('/categories/featured/:categoryId', authMiddleware, CategoryController.toggleFeatured);

router.patch('/categories/reorder/:categoryId', authMiddleware, CategoryController.reorderCategory);

export default router;
