import express from 'express';
import PortfolioAlbumController from '#controllers/vendor/portfolioAlbumController.js';
import authMiddleware from '#middleware/authMiddleware.js';
import { uploadAlbumMedia } from '#uploads/uploadMiddleware.js';

const router = express.Router();

router.get('/:portfolioId/albums', authMiddleware, PortfolioAlbumController.getAlbums);

router.get('/:portfolioId/albums/:albumId', authMiddleware, PortfolioAlbumController.getAlbum);

router.post('/:portfolioId/albums', authMiddleware, PortfolioAlbumController.createAlbum);

router.put('/:portfolioId/albums/:albumId', authMiddleware, PortfolioAlbumController.updateAlbum);

router.delete('/:portfolioId/albums/:albumId', authMiddleware, PortfolioAlbumController.deleteAlbum);

router.patch('/:portfolioId/albums/:albumId/reorder', authMiddleware, PortfolioAlbumController.reorderAlbum);

router.post('/albums/:albumId/media/upload', authMiddleware, uploadAlbumMedia, PortfolioAlbumController.uploadMedia);

export default router;
