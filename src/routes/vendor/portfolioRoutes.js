import express from 'express';
import PortfolioController from '#controllers/vendor/portfolioController.js';
import { authenticate, isVendor } from '#middleware/authMiddleware.js';
import { uploadPortfolioMedia } from '#middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', authenticate, isVendor, PortfolioController.getPortfolios);

router.get('/:portfolioId', authenticate, isVendor, PortfolioController.getPortfolio);

router.post('/', authenticate, isVendor, PortfolioController.createPortfolio);

router.put('/:portfolioId', authenticate, isVendor, PortfolioController.updatePortfolio);

router.delete('/:portfolioId', authenticate, isVendor, PortfolioController.deletePortfolio);

router.post('/:portfolioId/republish', authenticate, isVendor, PortfolioController.republishPortfolio);

router.patch('/:portfolioId/status', authenticate, isVendor, PortfolioController.updateStatus);

router.patch('/:portfolioId/featured', authenticate, isVendor, PortfolioController.updateFeaturedStatus);

router.post(
  '/:portfolioId/media/upload',
  authenticate,
  isVendor,
  uploadPortfolioMedia,
  PortfolioController.uploadMedia
);

router.get('/:portfolioId/media', authenticate, isVendor, PortfolioController.getMedia);

router.put('/:portfolioId/media/:mediaId', authenticate, isVendor, PortfolioController.updateMedia);

router.delete('/:portfolioId/media/:mediaId', authenticate, isVendor, PortfolioController.deleteMedia);

router.patch('/:portfolioId/media/:mediaId/primary', authenticate, isVendor, PortfolioController.setPrimaryMedia);

router.post('/:portfolioId/media/reorder', authenticate, isVendor, PortfolioController.reorderMedia);

export default router;
