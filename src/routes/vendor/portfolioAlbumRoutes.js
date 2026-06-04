import express from 'express';
import PortfolioAlbumController from '#controllers/vendor/portfolioAlbumController.js';
import { authenticate, isVendor } from '#middleware/authMiddleware.js';
import { uploadAlbumMedia } from '#middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/:portfolioId/albums', authenticate, isVendor, PortfolioAlbumController.getAlbums);

router.get('/:portfolioId/albums/:albumId', authenticate, isVendor, PortfolioAlbumController.getAlbum);

router.post('/:portfolioId/albums', authenticate, isVendor, PortfolioAlbumController.createAlbum);

router.put('/:portfolioId/albums/:albumId', authenticate, isVendor, PortfolioAlbumController.updateAlbum);

router.delete('/:portfolioId/albums/:albumId', authenticate, isVendor, PortfolioAlbumController.deleteAlbum);

router.patch('/:portfolioId/albums/:albumId/reorder', authenticate, isVendor, PortfolioAlbumController.reorderAlbum);

router.post('/albums/:albumId/media/upload', authenticate, isVendor, uploadAlbumMedia, PortfolioAlbumController.uploadMedia);

export default router;
