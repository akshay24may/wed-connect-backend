import express from 'express';
import PortfolioController from '#controllers/panel/portfolioController.js';
import authMiddleware from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, PortfolioController.getPortfolios);

router.get('/:portfolioId', authMiddleware, PortfolioController.getPortfolio);

router.patch('/:portfolioId/status', authMiddleware, PortfolioController.updateStatus);

router.patch('/:portfolioId/visibility', authMiddleware, PortfolioController.updateVisibility);

router.delete('/:portfolioId', authMiddleware, PortfolioController.deletePortfolio);

export default router;
