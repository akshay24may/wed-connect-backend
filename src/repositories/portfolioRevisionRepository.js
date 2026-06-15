import models from '#models/index.js';

const { PortfolioRevision, Media } = models;

class PortfolioRevisionRepository {
  async findByPortfolioId(portfolioId) {
    return await PortfolioRevision.findOne({
      where: { portfolioId, status: 'pending' }
    });
  }

  async findById(revisionId) {
    return await PortfolioRevision.findByPk(revisionId);
  }

  async create(portfolioId, data, userId) {
    return await PortfolioRevision.create(
      { portfolioId, ...data, status: 'pending' },
      { userId }
    );
  }

  async update(revisionId, data, userId) {
    const revision = await PortfolioRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.update(data, { userId });
  }

  async approve(revisionId, adminUserId) {
    const revision = await PortfolioRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.update(
      { status: 'approved', reviewedBy: adminUserId, reviewedAt: new Date() },
      { userId: adminUserId }
    );
  }

  async reject(revisionId, adminUserId, rejectionReason) {
    const revision = await PortfolioRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.update(
      { status: 'rejected', rejectionReason, reviewedBy: adminUserId, reviewedAt: new Date() },
      { userId: adminUserId }
    );
  }

  async softDelete(revisionId, userId) {
    const revision = await PortfolioRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.destroy({ userId });
  }

  async approvePendingMedia(portfolioRevisionId) {
    return await Media.update(
      { approvalStatus: 'approved', portfolioRevisionId: null },
      { where: { portfolioRevisionId, approvalStatus: 'pending' } }
    );
  }

  async rejectPendingMedia(portfolioRevisionId) {
    return await Media.update(
      { approvalStatus: 'rejected' },
      { where: { portfolioRevisionId, approvalStatus: 'pending' } }
    );
  }

  async getPendingMediaCount(portfolioRevisionId) {
    return await Media.count({
      where: { portfolioRevisionId, approvalStatus: 'pending' }
    });
  }
}

export default new PortfolioRevisionRepository();
