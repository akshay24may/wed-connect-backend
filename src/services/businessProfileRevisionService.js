import businessProfileRevisionRepository from '#repositories/businessProfileRevisionRepository.js';
import models, { sequelize } from '#models/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

const { BusinessProfile } = models;

const APPROVAL_FIELDS = [
  'businessName', 'businessTagline', 'about', 'teamDescription', 'celebrityWeddingsHandled',
  'certifications', 'awards', 'businessHours', 'websiteUrl', 'facebookUrl', 'instagramUrl',
  'youtubeUrl', 'linkedinUrl', 'contactPersonName', 'nameOnId',
  'businessLogo', 'businessBanner', 'businessMediaStorageType'
];

class BusinessProfileRevisionService {
  _extractApprovalFields(data) {
    const fields = {};
    for (const key of APPROVAL_FIELDS) {
      if (data[key] !== undefined) {
        fields[key] = data[key];
      }
    }
    return fields;
  }

  async getOrCreateRevision(businessProfileId, userId) {
    let revision = await businessProfileRevisionRepository.findByBusinessProfileId(businessProfileId);
    if (!revision) {
      revision = await businessProfileRevisionRepository.create(businessProfileId, {}, userId);
    }
    return revision;
  }

  async getRevisionStatus(businessProfileId, userId) {
    try {
      const profile = await BusinessProfile.findOne({ where: { id: businessProfileId, userId } });
      if (!profile) {
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND };
      }

      const revision = await businessProfileRevisionRepository.findByBusinessProfileId(businessProfileId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_REVISION_RETRIEVED,
        data: {
          hasRevision: !!revision,
          revision: revision
            ? { id: revision.id, status: revision.status, createdAt: revision.createdAt, updatedAt: revision.updatedAt }
            : null
        }
      };
    } catch (error) {
      console.error('Get business profile revision status error:', error);
      return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_FETCH_FAILED };
    }
  }

  async updateRevisionFields(businessProfileId, userId, data) {
    try {
      const approvalData = this._extractApprovalFields(data);
      if (Object.keys(approvalData).length === 0) return null;

      const revision = await this.getOrCreateRevision(businessProfileId, userId);
      await businessProfileRevisionRepository.update(revision.id, approvalData, userId);
      return revision;
    } catch (error) {
      console.error('Update business profile revision fields error:', error);
      throw error;
    }
  }

  async cancelRevision(businessProfileId, userId) {
    try {
      const profile = await BusinessProfile.findOne({ where: { id: businessProfileId, userId } });
      if (!profile) {
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND };
      }

      const revision = await businessProfileRevisionRepository.findByBusinessProfileId(businessProfileId);
      if (!revision) {
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_NOT_FOUND };
      }

      await businessProfileRevisionRepository.softDelete(revision.id, userId);

      return { success: true, message: SUCCESS_MESSAGES.BUSINESS_PROFILE_REVISION_CANCELLED };
    } catch (error) {
      console.error('Cancel business profile revision error:', error);
      return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_CANCEL_FAILED };
    }
  }

  async applyRevision(businessProfileId, adminUserId) {
    const t = await sequelize.transaction();
    try {
      const profile = await BusinessProfile.findByPk(businessProfileId, { transaction: t });
      if (!profile) {
        await t.rollback();
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND };
      }

      const revision = await businessProfileRevisionRepository.findByBusinessProfileId(businessProfileId);
      if (!revision) {
        await t.rollback();
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_NOT_FOUND };
      }

      if (revision.status !== 'pending') {
        await t.rollback();
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_NOT_PENDING };
      }

      const updatePayload = {};
      for (const key of APPROVAL_FIELDS) {
        if (revision[key] !== null && revision[key] !== undefined) {
          updatePayload[key] = revision[key];
        }
      }

      if (Object.keys(updatePayload).length > 0) {
        await profile.update(updatePayload, { userId: adminUserId, transaction: t });
      }

      await businessProfileRevisionRepository.approve(revision.id, adminUserId);

      await t.commit();

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_REVISION_APPROVED,
        data: { businessProfileId }
      };
    } catch (error) {
      await t.rollback();
      console.error('Apply business profile revision error:', error);
      return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_APPROVE_FAILED };
    }
  }

  async rejectRevision(businessProfileId, adminUserId, rejectionReason) {
    try {
      if (!rejectionReason) {
        return { success: false, message: ERROR_MESSAGES.REJECTION_REASON_REQUIRED };
      }

      const revision = await businessProfileRevisionRepository.findByBusinessProfileId(businessProfileId);
      if (!revision) {
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_NOT_FOUND };
      }

      if (revision.status !== 'pending') {
        return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_NOT_PENDING };
      }

      await businessProfileRevisionRepository.reject(revision.id, adminUserId, rejectionReason);

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_REVISION_REJECTED
      };
    } catch (error) {
      console.error('Reject business profile revision error:', error);
      return { success: false, message: ERROR_MESSAGES.BUSINESS_PROFILE_REVISION_REJECT_FAILED };
    }
  }
}

export default new BusinessProfileRevisionService();
