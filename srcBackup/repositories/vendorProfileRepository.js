import models from '#models/index.js';

const { VendorProfile, User, Role } = models;

class VendorProfileRepository {
  async findByUserId(userId) {
    return await VendorProfile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'mobile', 'email', 'profilePhoto', 'avatarPhoto'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['id', 'name', 'slug']
            }
          ]
        }
      ]
    });
  }

  async createVendorProfile(vendorData) {
    return await VendorProfile.create(vendorData);
  }

  async updateVendorProfile(userId, vendorData) {
    const updateData = {};

    if (vendorData.businessName !== undefined) updateData.businessName = vendorData.businessName;
    if (vendorData.businessPan !== undefined) updateData.businessPan = vendorData.businessPan;
    if (vendorData.gstin !== undefined) updateData.gstin = vendorData.gstin;
    if (vendorData.businessRegistrationNumber !== undefined) updateData.businessRegistrationNumber = vendorData.businessRegistrationNumber;
    if (vendorData.businessType !== undefined) updateData.businessType = vendorData.businessType;
    if (vendorData.establishmentYear !== undefined) updateData.establishmentYear = vendorData.establishmentYear;
    if (vendorData.nameOnId !== undefined) updateData.nameOnId = vendorData.nameOnId;
    if (vendorData.aadharNumber !== undefined) updateData.aadharNumber = vendorData.aadharNumber;
    if (vendorData.panNumber !== undefined) updateData.panNumber = vendorData.panNumber;
    if (vendorData.alternateMobileOne !== undefined) updateData.alternateMobileOne = vendorData.alternateMobileOne;
    if (vendorData.alternateMobileTwo !== undefined) updateData.alternateMobileTwo = vendorData.alternateMobileTwo;
    if (vendorData.whatsappMobile !== undefined) updateData.whatsappMobile = vendorData.whatsappMobile;
    if (vendorData.yearsOfExperience !== undefined) updateData.yearsOfExperience = vendorData.yearsOfExperience;
    if (vendorData.teamSize !== undefined) updateData.teamSize = vendorData.teamSize;
    if (vendorData.portfolioTagline !== undefined) updateData.portfolioTagline = vendorData.portfolioTagline;
    if (vendorData.specializations !== undefined) updateData.specializations = vendorData.specializations;
    if (vendorData.serviceAreas !== undefined) updateData.serviceAreas = vendorData.serviceAreas;
    if (vendorData.certifications !== undefined) updateData.certifications = vendorData.certifications;
    if (vendorData.awards !== undefined) updateData.awards = vendorData.awards;
    if (vendorData.businessEmail !== undefined) updateData.businessEmail = vendorData.businessEmail;
    if (vendorData.businessPhone !== undefined) updateData.businessPhone = vendorData.businessPhone;
    if (vendorData.websiteUrl !== undefined) updateData.websiteUrl = vendorData.websiteUrl;
    if (vendorData.facebookUrl !== undefined) updateData.facebookUrl = vendorData.facebookUrl;
    if (vendorData.instagramUrl !== undefined) updateData.instagramUrl = vendorData.instagramUrl;
    if (vendorData.youtubeUrl !== undefined) updateData.youtubeUrl = vendorData.youtubeUrl;
    if (vendorData.linkedinUrl !== undefined) updateData.linkedinUrl = vendorData.linkedinUrl;
    if (vendorData.businessHours !== undefined) updateData.businessHours = vendorData.businessHours;
    if (vendorData.acceptsAdvanceBooking !== undefined) updateData.acceptsAdvanceBooking = vendorData.acceptsAdvanceBooking;
    if (vendorData.minAdvanceBookingDays !== undefined) updateData.minAdvanceBookingDays = vendorData.minAdvanceBookingDays;
    if (vendorData.cancellationPolicy !== undefined) updateData.cancellationPolicy = vendorData.cancellationPolicy;

    await VendorProfile.update(updateData, {
      where: { userId }
    });

    return await this.findByUserId(userId);
  }

  async updateBusinessLogo(userId, logoPath, storageType) {
    return await VendorProfile.update(
      {
        businessLogo: logoPath,
        businessMediaStorageType: storageType
      },
      { where: { userId } }
    );
  }

  async updateBusinessBanner(userId, bannerPath, storageType) {
    return await VendorProfile.update(
      {
        businessBanner: bannerPath,
        businessMediaStorageType: storageType
      },
      { where: { userId } }
    );
  }

  async deleteBusinessLogo(userId) {
    return await VendorProfile.update(
      {
        businessLogo: null
      },
      { where: { userId } }
    );
  }

  async deleteBusinessBanner(userId) {
    return await VendorProfile.update(
      {
        businessBanner: null
      },
      { where: { userId } }
    );
  }

  async checkAlternateMobileExists(mobile, excludeUserId = null) {
    const where = {
      [models.Sequelize.Op.or]: [
        { alternateMobileOne: mobile },
        { alternateMobileTwo: mobile },
        { whatsappMobile: mobile }
      ]
    };

    if (excludeUserId) {
      where.userId = { [models.Sequelize.Op.ne]: excludeUserId };
    }

    return await VendorProfile.findOne({ where });
  }
}

export default new VendorProfileRepository();
