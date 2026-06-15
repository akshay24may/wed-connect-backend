import portfolioAlbumRepository from '#repositories/portfolioAlbumRepository.js';
import portfolioRepository from '#repositories/portfolioRepository.js';
import subscriptionCheckService from '#services/subscriptionCheckService.js';
import subscriptionCheckRepository from '#repositories/subscriptionCheckRepository.js';
import portfolioRevisionService from '#services/portfolioRevisionService.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class PortfolioAlbumService {
  async getAlbums(portfolioId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const albums = await portfolioAlbumRepository.findByPortfolioId(portfolioId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUMS_RETRIEVED,
        data: { albums }
      };
    } catch (error) {
      console.error('Get albums error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUMS_FETCH_FAILED
      };
    }
  }

  async getAlbum(portfolioId, albumId, userId) {
    try {
      const album = await portfolioAlbumRepository.findByIdAndUserId(albumId, userId);

      if (!album) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      if (album.portfolio.id !== parseInt(portfolioId)) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUM_RETRIEVED,
        data: { album }
      };
    } catch (error) {
      console.error('Get album error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUM_FETCH_FAILED
      };
    }
  }

  async createAlbum(portfolioId, userId, albumData) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (portfolio.userSubscriptionId) {
        const currentAlbumCount = await subscriptionCheckRepository.countAlbumsByPortfolio(portfolioId);
        const quotaCheck = await subscriptionCheckService.checkAlbumQuota(
          portfolio.userSubscriptionId,
          currentAlbumCount
        );

        if (!quotaCheck.success) {
          return quotaCheck;
        }
      }

      if (!albumData.albumName) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NAME_REQUIRED
        };
      }

      if (albumData.albumName.length < 3) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NAME_TOO_SHORT
        };
      }

      const data = {
        portfolioId: parseInt(portfolioId),
        userId,
        albumName: albumData.albumName,
        albumDescription: albumData.albumDescription,
        cityId: albumData.cityId,
        citySlug: albumData.citySlug,
        locationName: albumData.locationName,
        latitude: albumData.latitude,
        longitude: albumData.longitude,
        displayOrder: albumData.displayOrder || 0,
        isFeatured: albumData.isFeatured || false,
        isPublic: albumData.isPublic !== undefined ? albumData.isPublic : true
      };

      // Published portfolio: album goes pending until revision is approved
      if (portfolio.status === 'published') {
        data.approvalStatus = 'pending';
        await portfolioRevisionService.getOrCreateRevision(portfolioId, userId);
      }

      const album = await portfolioAlbumRepository.create(data, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUM_CREATED,
        data: { album }
      };
    } catch (error) {
      console.error('Create album error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUM_CREATE_FAILED
      };
    }
  }

  async updateAlbum(portfolioId, albumId, userId, albumData) {
    try {
      const album = await portfolioAlbumRepository.findByIdAndUserId(albumId, userId);

      if (!album) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      if (album.portfolio.id !== parseInt(portfolioId)) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      if (albumData.albumName && albumData.albumName.length < 3) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NAME_TOO_SHORT
        };
      }

      const hasDirectFields = ['cityId', 'citySlug', 'latitude', 'longitude', 'displayOrder', 'isFeatured', 'isPublic']
        .some(key => albumData[key] !== undefined);
      const hasApprovalFields = ['albumName', 'albumDescription', 'locationName']
        .some(key => albumData[key] !== undefined);

      // For published portfolios, route text edits through pending_album_edits
      const portfolio = album.portfolio;
      if (portfolio && portfolio.status === 'published' && hasApprovalFields) {
        const directData = {};
        if (albumData.cityId !== undefined) directData.cityId = albumData.cityId;
        if (albumData.citySlug !== undefined) directData.citySlug = albumData.citySlug;
        if (albumData.latitude !== undefined) directData.latitude = albumData.latitude;
        if (albumData.longitude !== undefined) directData.longitude = albumData.longitude;
        if (albumData.displayOrder !== undefined) directData.displayOrder = albumData.displayOrder;
        if (albumData.isFeatured !== undefined) directData.isFeatured = albumData.isFeatured;
        if (albumData.isPublic !== undefined) directData.isPublic = albumData.isPublic;

        if (Object.keys(directData).length > 0) {
          await portfolioAlbumRepository.update(albumId, directData, userId);
        }

        const pendingEdits = {};
        if (albumData.albumName !== undefined) pendingEdits.albumName = albumData.albumName;
        if (albumData.albumDescription !== undefined) pendingEdits.albumDescription = albumData.albumDescription;
        if (albumData.locationName !== undefined) pendingEdits.locationName = albumData.locationName;

        await portfolioRevisionService.updateAlbumPendingEdits(album, pendingEdits, userId);
        await portfolioRevisionService.getOrCreateRevision(portfolioId, userId);

        const updatedAlbum = await portfolioAlbumRepository.findByIdAndUserId(albumId, userId);
        return {
          success: true,
          message: 'Album text changes are pending admin approval.',
          data: { album: updatedAlbum }
        };
      }

      const updateData = {};
      if (albumData.albumName !== undefined) updateData.albumName = albumData.albumName;
      if (albumData.albumDescription !== undefined) updateData.albumDescription = albumData.albumDescription;
      if (albumData.cityId !== undefined) updateData.cityId = albumData.cityId;
      if (albumData.citySlug !== undefined) updateData.citySlug = albumData.citySlug;
      if (albumData.locationName !== undefined) updateData.locationName = albumData.locationName;
      if (albumData.latitude !== undefined) updateData.latitude = albumData.latitude;
      if (albumData.longitude !== undefined) updateData.longitude = albumData.longitude;
      if (albumData.displayOrder !== undefined) updateData.displayOrder = albumData.displayOrder;
      if (albumData.isFeatured !== undefined) updateData.isFeatured = albumData.isFeatured;
      if (albumData.isPublic !== undefined) updateData.isPublic = albumData.isPublic;

      const updatedAlbum = await portfolioAlbumRepository.update(albumId, updateData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUM_UPDATED,
        data: { album: updatedAlbum }
      };
    } catch (error) {
      console.error('Update album error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUM_UPDATE_FAILED
      };
    }
  }

  async deleteAlbum(portfolioId, albumId, userId) {
    try {
      const album = await portfolioAlbumRepository.findByIdAndUserId(albumId, userId);

      if (!album) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      if (album.portfolio.id !== parseInt(portfolioId)) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      await portfolioAlbumRepository.delete(albumId, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUM_DELETED
      };
    } catch (error) {
      console.error('Delete album error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUM_DELETE_FAILED
      };
    }
  }

  async reorderAlbum(portfolioId, albumId, userId, displayOrder) {
    try {
      const album = await portfolioAlbumRepository.findByIdAndUserId(albumId, userId);

      if (!album) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      if (album.portfolio.id !== parseInt(portfolioId)) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      const updatedAlbum = await portfolioAlbumRepository.updateDisplayOrder(albumId, displayOrder, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUM_REORDERED,
        data: { album: updatedAlbum }
      };
    } catch (error) {
      console.error('Reorder album error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUM_REORDER_FAILED
      };
    }
  }
}

export default new PortfolioAlbumService();
