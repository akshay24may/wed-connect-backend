import portfolioRevisionRepository from '#repositories/portfolioRevisionRepository.js';
import portfolioRepository from '#repositories/portfolioRepository.js';
import models, { sequelize } from '#models/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

const { Portfolio, PortfolioAlbum, Media } = models;

const APPROVAL_FIELDS = [
  'title', 'description', 'longDescription', 'servicesDescription', 'workingStyle',
  'address', 'highlights', 'servicesOfferedTags', 'coverageCities', 'financialTerms',
  'priceBreakdown', 'serviceDetails', 'cancellationPolicyUser', 'cancellationPolicyVendor',
  'coverImage', 'coverImageStorageType'
];

class PortfolioRevisionService {
  _extractApprovalFields(data) {
    const fields = {};
    for (const key of APPROVAL_FIELDS) {
      if (data[key] !== undefined) {
        fields[key] = data[key];
      }
    }
    return fields;
  }

  async getOrCreateRevision(portfolioId, userId) {
    let revision = await portfolioRevisionRepository.findByPortfolioId(portfolioId);
    if (!revision) {
      revision = await portfolioRevisionRepository.create(portfolioId, {}, userId);
    }
    return revision;
  }

  async getRevisionStatus(portfolioId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);
      if (!portfolio) {
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND };
      }

      const revision = await portfolioRevisionRepository.findByPortfolioId(portfolioId);

      if (!revision) {
        return {
          success: true,
          message: SUCCESS_MESSAGES.PORTFOLIO_REVISION_RETRIEVED,
          data: { hasRevision: false, revision: null }
        };
      }

      const pendingMediaCount = await portfolioRevisionRepository.getPendingMediaCount(revision.id);
      const pendingAlbumEdits = await PortfolioAlbum.count({
        where: { portfolioId, approvalStatus: 'pending' }
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_REVISION_RETRIEVED,
        data: {
          hasRevision: true,
          revision: {
            id: revision.id,
            status: revision.status,
            pendingMediaCount,
            pendingAlbumEdits,
            createdAt: revision.createdAt,
            updatedAt: revision.updatedAt
          }
        }
      };
    } catch (error) {
      console.error('Get revision status error:', error);
      return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_FETCH_FAILED };
    }
  }

  async updateRevisionFields(portfolioId, userId, data) {
    try {
      const approvalData = this._extractApprovalFields(data);
      if (Object.keys(approvalData).length === 0) return null;

      const revision = await this.getOrCreateRevision(portfolioId, userId);
      await portfolioRevisionRepository.update(revision.id, approvalData, userId);
      return revision;
    } catch (error) {
      console.error('Update revision fields error:', error);
      throw error;
    }
  }

  async updateAlbumPendingEdits(album, proposedEdits, userId) {
    try {
      await album.update(
        { pendingAlbumEdits: proposedEdits },
        { userId }
      );
    } catch (error) {
      console.error('Update album pending edits error:', error);
      throw error;
    }
  }

  async cancelRevision(portfolioId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);
      if (!portfolio) {
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND };
      }

      const revision = await portfolioRevisionRepository.findByPortfolioId(portfolioId);
      if (!revision) {
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_NOT_FOUND };
      }

      await portfolioRevisionRepository.rejectPendingMedia(revision.id);

      await PortfolioAlbum.update(
        { approvalStatus: 'rejected', pendingAlbumEdits: null },
        { where: { portfolioId, approvalStatus: 'pending' } }
      );

      await portfolioRevisionRepository.softDelete(revision.id, userId);

      return { success: true, message: SUCCESS_MESSAGES.PORTFOLIO_REVISION_CANCELLED };
    } catch (error) {
      console.error('Cancel revision error:', error);
      return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_CANCEL_FAILED };
    }
  }

  async applyRevision(portfolioId, adminUserId) {
    const t = await sequelize.transaction();
    try {
      const portfolio = await Portfolio.findByPk(portfolioId, { transaction: t });
      if (!portfolio) {
        await t.rollback();
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND };
      }

      const revision = await portfolioRevisionRepository.findByPortfolioId(portfolioId);
      if (!revision) {
        await t.rollback();
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_NOT_FOUND };
      }

      if (revision.status !== 'pending') {
        await t.rollback();
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_NOT_PENDING };
      }

      // Build update payload from only non-null revision fields
      const updatePayload = {};
      for (const key of APPROVAL_FIELDS) {
        if (revision[key] !== null && revision[key] !== undefined) {
          updatePayload[key] = revision[key];
        }
      }

      if (Object.keys(updatePayload).length > 0) {
        await portfolio.update(updatePayload, { userId: adminUserId, transaction: t });
      }

      // Apply pending album text edits
      const albumsWithEdits = await PortfolioAlbum.findAll({
        where: { portfolioId, approvalStatus: 'approved' },
        transaction: t
      });

      for (const album of albumsWithEdits) {
        if (album.pendingAlbumEdits) {
          const historyEntry = {
            previousValues: {
              albumName: album.albumName,
              albumDescription: album.albumDescription,
              locationName: album.locationName
            },
            proposedValues: album.pendingAlbumEdits,
            action: 'approved',
            reviewedBy: adminUserId,
            reviewedAt: new Date().toISOString()
          };
          const history = album.albumEditHistory || [];
          await album.update(
            {
              ...album.pendingAlbumEdits,
              pendingAlbumEdits: null,
              albumEditHistory: [...history, historyEntry]
            },
            { userId: adminUserId, transaction: t }
          );
        }
      }

      // Approve new pending albums
      await PortfolioAlbum.update(
        { approvalStatus: 'approved' },
        { where: { portfolioId, approvalStatus: 'pending' }, transaction: t }
      );

      // Approve pending media
      await Media.update(
        { approvalStatus: 'approved', portfolioRevisionId: null },
        { where: { portfolioRevisionId: revision.id, approvalStatus: 'pending' }, transaction: t }
      );

      await portfolioRevisionRepository.approve(revision.id, adminUserId);

      await t.commit();

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_REVISION_APPROVED,
        data: { portfolioId }
      };
    } catch (error) {
      await t.rollback();
      console.error('Apply revision error:', error);
      return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_APPROVE_FAILED };
    }
  }

  async rejectRevision(portfolioId, adminUserId, rejectionReason) {
    try {
      if (!rejectionReason) {
        return { success: false, message: ERROR_MESSAGES.REJECTION_REASON_REQUIRED };
      }

      const revision = await portfolioRevisionRepository.findByPortfolioId(portfolioId);
      if (!revision) {
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_NOT_FOUND };
      }

      if (revision.status !== 'pending') {
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_NOT_PENDING };
      }

      await portfolioRevisionRepository.rejectPendingMedia(revision.id);

      // Clear pending album edits and reject pending albums
      const albumsWithEdits = await PortfolioAlbum.findAll({
        where: { portfolioId, approvalStatus: 'approved' }
      });
      for (const album of albumsWithEdits) {
        if (album.pendingAlbumEdits) {
          const historyEntry = {
            previousValues: {
              albumName: album.albumName,
              albumDescription: album.albumDescription,
              locationName: album.locationName
            },
            proposedValues: album.pendingAlbumEdits,
            action: 'rejected',
            reviewedBy: adminUserId,
            reviewedAt: new Date().toISOString()
          };
          const history = album.albumEditHistory || [];
          await album.update({
            pendingAlbumEdits: null,
            albumEditHistory: [...history, historyEntry]
          }, { userId: adminUserId });
        }
      }

      await PortfolioAlbum.update(
        { approvalStatus: 'rejected' },
        { where: { portfolioId, approvalStatus: 'pending' } }
      );

      await portfolioRevisionRepository.reject(revision.id, adminUserId, rejectionReason);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_REVISION_REJECTED
      };
    } catch (error) {
      console.error('Reject revision error:', error);
      return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_REJECT_FAILED };
    }
  }

  async getRevisionDiff(portfolioId) {
    try {
      const portfolio = await portfolioRepository.findById(portfolioId);
      if (!portfolio) {
        return { success: false, message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND };
      }

      const revision = await portfolioRevisionRepository.findByPortfolioId(portfolioId);
      const pendingMedia = revision
        ? await Media.findAll({ where: { portfolioRevisionId: revision.id, approvalStatus: 'pending' } })
        : [];

      const pendingAlbums = await PortfolioAlbum.findAll({
        where: { portfolioId, approvalStatus: 'pending' }
      });

      const albumsWithPendingEdits = await PortfolioAlbum.findAll({
        where: { portfolioId, approvalStatus: 'approved' }
      }).then(albums => albums.filter(a => a.pendingAlbumEdits !== null));

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_REVISION_DIFF_RETRIEVED,
        data: {
          original: portfolio,
          revision: revision || null,
          pendingMedia,
          pendingAlbums,
          albumsWithPendingEdits
        }
      };
    } catch (error) {
      console.error('Get revision diff error:', error);
      return { success: false, message: ERROR_MESSAGES.PORTFOLIO_REVISION_FETCH_FAILED };
    }
  }
}

export default new PortfolioRevisionService();
