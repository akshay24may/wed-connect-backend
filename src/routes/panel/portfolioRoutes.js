import express from 'express';
import PortfolioController from '#controllers/panel/portfolioController.js';
import { authenticate, isPanelUser } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, isPanelUser, PortfolioController.getPortfolios);

router.get('/:portfolioId', authenticate, isPanelUser, PortfolioController.getPortfolio);

router.patch('/:portfolioId/status', authenticate, isPanelUser, PortfolioController.updateStatus);

router.patch('/:portfolioId/visibility', authenticate, isPanelUser, PortfolioController.updateVisibility);

router.delete('/:portfolioId', authenticate, isPanelUser, PortfolioController.deletePortfolio);

export default router;
