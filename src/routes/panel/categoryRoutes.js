import express from 'express';
import CategoryController from '#controllers/panel/categoryController.js';
import { authenticate, isPanelUser } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', authenticate, isPanelUser, CategoryController.getCategories);

router.get('/categories/:categoryId', authenticate, isPanelUser, CategoryController.getCategory);

router.post('/categories', authenticate, isPanelUser, CategoryController.createCategory);

router.put('/categories/:categoryId', authenticate, isPanelUser, CategoryController.updateCategory);

router.delete('/categories/:categoryId', authenticate, isPanelUser, CategoryController.deleteCategory);

router.patch('/categories/status/:categoryId', authenticate, isPanelUser, CategoryController.toggleStatus);

router.patch('/categories/featured/:categoryId', authenticate, isPanelUser, CategoryController.toggleFeatured);

router.patch('/categories/reorder/:categoryId', authenticate, isPanelUser, CategoryController.reorderCategory);

export default router;
