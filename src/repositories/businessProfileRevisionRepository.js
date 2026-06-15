import models from '#models/index.js';

const { BusinessProfileRevision } = models;

class BusinessProfileRevisionRepository {
  async findByBusinessProfileId(businessProfileId) {
    return await BusinessProfileRevision.findOne({
      where: { businessProfileId, status: 'pending' }
    });
  }

  async findById(revisionId) {
    return await BusinessProfileRevision.findByPk(revisionId);
  }

  async create(businessProfileId, data, userId) {
    return await BusinessProfileRevision.create(
      { businessProfileId, ...data, status: 'pending' },
      { userId }
    );
  }

  async update(revisionId, data, userId) {
    const revision = await BusinessProfileRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.update(data, { userId });
  }

  async approve(revisionId, adminUserId) {
    const revision = await BusinessProfileRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.update(
      { status: 'approved', reviewedBy: adminUserId, reviewedAt: new Date() },
      { userId: adminUserId }
    );
  }

  async reject(revisionId, adminUserId, rejectionReason) {
    const revision = await BusinessProfileRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.update(
      { status: 'rejected', rejectionReason, reviewedBy: adminUserId, reviewedAt: new Date() },
      { userId: adminUserId }
    );
  }

  async softDelete(revisionId, userId) {
    const revision = await BusinessProfileRevision.findByPk(revisionId);
    if (!revision) return null;
    return await revision.destroy({ userId });
  }
}

export default new BusinessProfileRevisionRepository();
