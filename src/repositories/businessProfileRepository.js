import models from '#models/index.js';

const { BusinessProfile, User } = models;

class BusinessProfileRepository {
  async findByUserId(userId) {
    return await BusinessProfile.findAll({
      where: { userId },
      attributes: [
        'id',
        'businessName',
        'businessTagline',
        'businessLogo',
        'businessBanner',
        'businessMediaStorageType',
        'businessEmail',
        'businessPhone',
        'contactPersonName',
        'businessType',
        'establishmentYear',
        'teamSize',
        'yearsOfExperience',
        'websiteUrl',
        'facebookUrl',
        'instagramUrl',
        'youtubeUrl',
        'linkedinUrl',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt']
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await BusinessProfile.findByPk(id, {
      attributes: [
        'id',
        'userId',
        'businessName',
        'businessTagline',
        'businessLogo',
        'businessBanner',
        'businessMediaStorageType',
        'businessEmail',
        'businessPhone',
        'contactPersonName',
        'businessPan',
        'gstin',
        'businessRegistrationNumber',
        'businessType',
        'establishmentYear',
        'nameOnId',
        'aadharNumber',
        'panNumber',
        'alternateMobileOne',
        'alternateMobileTwo',
        'whatsappMobile',
        'teamDescription',
        'teamSize',
        'yearsOfExperience',
        'businessHours',
        'certifications',
        'awards',
        'celebrityWeddingsHandled',
        'websiteUrl',
        'facebookUrl',
        'instagramUrl',
        'youtubeUrl',
        'linkedinUrl',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt']
      ]
    });
  }

  async findByIdAndUserId(id, userId) {
    return await BusinessProfile.findOne({
      where: { id, userId }
    });
  }

  async create(businessData, userId) {
    return await BusinessProfile.create(businessData, { userId });
  }

  async update(id, businessData, userId) {
    const business = await BusinessProfile.findByPk(id);
    if (!business) return null;

    await business.update(businessData, { userId });
    return business;
  }

  async delete(id, userId) {
    const business = await BusinessProfile.findByPk(id);
    if (!business) return null;

    await business.destroy({ userId });
    return business;
  }

  async countByUserId(userId) {
    return await BusinessProfile.count({
      where: { userId }
    });
  }

  async updateMedia(id, mediaData, userId) {
    const business = await BusinessProfile.findByPk(id);
    if (!business) return null;

    await business.update(mediaData, { userId });
    return business;
  }
}

export default new BusinessProfileRepository();
