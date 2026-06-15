import portfolioRepository from '#repositories/portfolioRepository.js';
import subscriptionCheckService from '#services/subscriptionCheckService.js';
import subscriptionCheckRepository from '#repositories/subscriptionCheckRepository.js';
import portfolioRevisionService from '#services/portfolioRevisionService.js';
import models from '#models/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';
import { MEDIA_ENTITY_TYPE } from '#utils/constants/databaseEnums.js';

const { Media } = models;

class PortfolioMediaService {
  async uploadMedia(portfolioId, userId, files, mediaType, subEntityType = null, subEntityId = null) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (!files || files.length === 0) {
        return {
          success: false,
          message: 'No files provided for upload'
        };
      }

      if (portfolio.userSubscriptionId) {
        const totalFileSizeMB = files.reduce((sum, file) => sum + (file.size / (1024 * 1024)), 0);
        const storageCheck = await subscriptionCheckService.checkStorageQuota(
          portfolio.userSubscriptionId,
          totalFileSizeMB
        );

        if (!storageCheck.success) {
          return storageCheck;
        }

        if (subEntityType === 'album' && subEntityId) {
          if (mediaType === 'photo') {
            const currentPhotoCount = await subscriptionCheckRepository.countPhotosByAlbum(portfolioId, subEntityId);
            const photoCheck = await subscriptionCheckService.checkPhotoQuota(
              portfolio.userSubscriptionId,
              portfolioId,
              subEntityId,
              currentPhotoCount
            );

            if (!photoCheck.success) {
              return photoCheck;
            }

            if (currentPhotoCount + files.length > photoCheck.data.maxAllowed) {
              return {
                success: false,
                message: `Cannot upload ${files.length} photos. Only ${photoCheck.data.remaining} slots remaining.`
              };
            }
          }

          if (mediaType === 'video') {
            const currentVideoCount = await subscriptionCheckRepository.countVideosByAlbum(portfolioId, subEntityId);
            const videoCheck = await subscriptionCheckService.checkVideoQuota(
              portfolio.userSubscriptionId,
              portfolioId,
              subEntityId,
              currentVideoCount
            );

            if (!videoCheck.success) {
              return videoCheck;
            }

            if (currentVideoCount + files.length > videoCheck.data.maxAllowed) {
              return {
                success: false,
                message: `Cannot upload ${files.length} videos. Only ${videoCheck.data.remaining} slots remaining.`
              };
            }
          }
        }
      }

      const storageType = process.env.STORAGE_TYPE || 'local';
      const uploaded = [];

      // For published portfolios, new uploads are pending until revision is approved
      let revisionId = null;
      if (portfolio.status === 'published') {
        const revision = await portfolioRevisionService.getOrCreateRevision(portfolioId, userId);
        revisionId = revision.id;
      }

      const maxDisplayOrder = await Media.max('displayOrder', {
        where: {
          entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
          entityId: portfolioId,
          subEntityType: subEntityType || null,
          subEntityId: subEntityId || null
        }
      }) || -1;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const mediaData = {
          entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
          entityId: portfolioId,
          subEntityType: subEntityType || null,
          subEntityId: subEntityId || null,
          mediaType: mediaType,
          mediaUrl: file.path,
          thumbnailUrl: file.thumbnailPath || null,
          storageType: storageType,
          fileName: file.filename,
          fileSizeBytes: file.size,
          width: file.width || null,
          height: file.height || null,
          duration: file.duration || null,
          displayOrder: maxDisplayOrder + i + 1,
          isPrimary: false,
          approvalStatus: revisionId ? 'pending' : 'approved',
          portfolioRevisionId: revisionId || null
        };

        const media = await Media.create(mediaData, { userId });
        uploaded.push(media);
      }

      return {
        success: true,
        message: revisionId
          ? 'Media uploaded and pending admin approval.'
          : SUCCESS_MESSAGES.PORTFOLIO_MEDIA_UPLOADED,
        data: { uploaded }
      };
    } catch (error) {
      console.error('Upload portfolio media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_MEDIA_UPLOAD_FAILED
      };
    }
  }

  async getMedia(portfolioId, userId, filters = {}) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const where = {
        entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
        entityId: portfolioId
      };

      if (filters.subEntityType) {
        where.subEntityType = filters.subEntityType;
      }

      if (filters.subEntityId) {
        where.subEntityId = filters.subEntityId;
      }

      if (filters.mediaType) {
        where.mediaType = filters.mediaType;
      }

      const media = await Media.findAll({
        where,
        order: [['displayOrder', 'ASC'], ['created_at', 'ASC']]
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_MEDIA_RETRIEVED,
        data: { media }
      };
    } catch (error) {
      console.error('Get portfolio media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_MEDIA_FETCH_FAILED
      };
    }
  }

  async updateMedia(portfolioId, mediaId, userId, metadata) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const media = await Media.findOne({
        where: {
          id: mediaId,
          entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
          entityId: portfolioId
        }
      });

      if (!media) {
        return {
          success: false,
          message: ERROR_MESSAGES.MEDIA_NOT_FOUND
        };
      }

      const updateData = {};
      if (metadata.displayOrder !== undefined) updateData.displayOrder = metadata.displayOrder;
      if (metadata.subEntityType !== undefined) updateData.subEntityType = metadata.subEntityType;
      if (metadata.subEntityId !== undefined) updateData.subEntityId = metadata.subEntityId;

      await media.update(updateData, { userId });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_MEDIA_UPDATED,
        data: { media }
      };
    } catch (error) {
      console.error('Update portfolio media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_MEDIA_UPDATE_FAILED
      };
    }
  }

  async deleteMedia(portfolioId, mediaId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const media = await Media.findOne({
        where: {
          id: mediaId,
          entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
          entityId: portfolioId
        }
      });

      if (!media) {
        return {
          success: false,
          message: ERROR_MESSAGES.MEDIA_NOT_FOUND
        };
      }

      await media.destroy({ userId });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_MEDIA_DELETED
      };
    } catch (error) {
      console.error('Delete portfolio media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_MEDIA_DELETE_FAILED
      };
    }
  }

  async setPrimaryMedia(portfolioId, mediaId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const media = await Media.findOne({
        where: {
          id: mediaId,
          entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
          entityId: portfolioId
        }
      });

      if (!media) {
        return {
          success: false,
          message: ERROR_MESSAGES.MEDIA_NOT_FOUND
        };
      }

      await Media.update(
        { isPrimary: false },
        {
          where: {
            entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
            entityId: portfolioId
          }
        }
      );

      await media.update({ isPrimary: true }, { userId });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_PRIMARY_MEDIA_SET,
        data: { media }
      };
    } catch (error) {
      console.error('Set primary media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_PRIMARY_MEDIA_FAILED
      };
    }
  }

  async reorderMedia(portfolioId, userId, mediaIds) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
        return {
          success: false,
          message: 'Media IDs array is required'
        };
      }

      for (let i = 0; i < mediaIds.length; i++) {
        await Media.update(
          { displayOrder: i },
          {
            where: {
              id: mediaIds[i],
              entityType: MEDIA_ENTITY_TYPE.PORTFOLIO,
              entityId: portfolioId
            }
          }
        );
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_MEDIA_REORDERED
      };
    } catch (error) {
      console.error('Reorder media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_MEDIA_REORDER_FAILED
      };
    }
  }
}

export default new PortfolioMediaService();
