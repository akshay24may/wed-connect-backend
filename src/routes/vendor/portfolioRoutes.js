import express from 'express';
import PortfolioController from '#controllers/vendor/portfolioController.js';
import authMiddleware from '#middleware/authMiddleware.js';
import { uploadPortfolioMedia } from '#uploads/uploadMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, PortfolioController.getPortfolios);

router.get('/:portfolioId', authMiddleware, PortfolioController.getPortfolio);

router.post('/', authMiddleware, PortfolioController.createPortfolio);

router.put('/:portfolioId', authMiddleware, PortfolioController.updatePortfolio);

router.delete('/:portfolioId', authMiddleware, PortfolioController.deletePortfolio);

router.post('/:portfolioId/republish', authMiddleware, PortfolioController.republishPortfolio);

router.patch('/:portfolioId/status', authMiddleware, PortfolioController.updateStatus);

router.patch('/:portfolioId/featured', authMiddleware, PortfolioController.updateFeaturedStatus);

router.post(
  '/:portfolioId/media/upload',
  authMiddleware,
  uploadPortfolioMedia,
  PortfolioController.uploadMedia
);

router.get('/:portfolioId/media', authMiddleware, PortfolioController.getMedia);

router.put('/:portfolioId/media/:mediaId', authMiddleware, PortfolioController.updateMedia);

router.delete('/:portfolioId/media/:mediaId', authMiddleware, PortfolioController.deleteMedia);

router.patch('/:portfolioId/media/:mediaId/primary', authMiddleware, PortfolioController.setPrimaryMedia);

router.post('/:portfolioId/media/reorder', authMiddleware, PortfolioController.reorderMedia);

export default router;
