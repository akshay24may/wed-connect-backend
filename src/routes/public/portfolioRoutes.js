import express from 'express';
import PortfolioController from '#controllers/public/portfolioController.js';

const router = express.Router();

router.get('/', PortfolioController.getPortfolios);

router.get('/:slug', PortfolioController.getPortfolioBySlug);

router.get('/share/:shareCode', PortfolioController.getPortfolioByShareCode);

router.get('/:portfolioId/media', PortfolioController.getMedia);

router.get('/:portfolioId/albums', PortfolioController.getAlbums);

router.get('/:portfolioId/albums/:albumSlug', PortfolioController.getAlbumBySlug);

export default router;
