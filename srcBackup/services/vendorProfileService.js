import vendorProfileRepository from '#repositories/vendorProfileRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class VendorProfileService {
  async getVendorProfile(userId) {
    const vendorProfile = await vendorProfileRepository.findByUserId(userId);
    
    if (!vendorProfile) {
      return {
        success: false,
        message: 'Vendor profile not found'
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.DATA_RETRIEVED,
      data: {
        vendorProfile: {
          id: vendorProfile.id,
          userId: vendorProfile.userId,
          businessName: vendorProfile.businessName,
          businessPan: vendorProfile.businessPan,
          gstin: vendorProfile.gstin,
          businessRegistrationNumber: vendorProfile.businessRegistrationNumber,
          businessType: vendorProfile.businessType,
          establishmentYear: vendorProfile.establishmentYear,
          nameOnId: vendorProfile.nameOnId,
          aadharNumber: vendorProfile.aadharNumber,
          panNumber: vendorProfile.panNumber,
          alternateMobileOne: vendorProfile.alternateMobileOne,
          alternateMobileTwo: vendorProfile.alternateMobileTwo,
          whatsappMobile: vendorProfile.whatsappMobile,
          businessLogo: vendorProfile.businessLogo,
          businessBanner: vendorProfile.businessBanner,
          yearsOfExperience: vendorProfile.yearsOfExperience,
          teamSize: vendorProfile.teamSize,
          portfolioTagline: vendorProfile.portfolioTagline,
          specializations: vendorProfile.specializations,
          serviceAreas: vendorProfile.serviceAreas,
          certifications: vendorProfile.certifications,
          awards: vendorProfile.awards,
          businessEmail: vendorProfile.businessEmail,
          businessPhone: vendorProfile.businessPhone,
          websiteUrl: vendorProfile.websiteUrl,
          facebookUrl: vendorProfile.facebookUrl,
          instagramUrl: vendorProfile.instagramUrl,
          youtubeUrl: vendorProfile.youtubeUrl,
          linkedinUrl: vendorProfile.linkedinUrl,
          businessHours: vendorProfile.businessHours,
          acceptsAdvanceBooking: vendorProfile.acceptsAdvanceBooking,
          minAdvanceBookingDays: vendorProfile.minAdvanceBookingDays,
          cancellationPolicy: vendorProfile.cancellationPolicy,
          isVerifiedVendor: vendorProfile.isVerifiedVendor,
          verifiedAt: vendorProfile.verifiedAt,
          verificationBadgeType: vendorProfile.verificationBadgeType,
          trustScore: vendorProfile.trustScore,
          user: vendorProfile.user ? {
            id: vendorProfile.user.id,
            fullName: vendorProfile.user.fullName,
            mobile: vendorProfile.user.mobile,
            email: vendorProfile.user.email,
            profilePhoto: vendorProfile.user.profilePhoto,
            avatarPhoto: vendorProfile.user.avatarPhoto,
            roleSlug: vendorProfile.user.role?.slug
          } : null
        }
      }
    };
  }

  async updateVendorProfile(userId, profileData) {
    const vendorProfile = await vendorProfileRepository.findByUserId(userId);
    
    if (!vendorProfile) {
      return {
        success: false,
        message: 'Vendor profile not found'
      };
    }

    if (profileData.alternateMobileOne) {
      const existing = await vendorProfileRepository.checkAlternateMobileExists(
        profileData.alternateMobileOne,
        userId
      );
      if (existing) {
        return {
          success: false,
          message: 'Alternate mobile number already in use'
        };
      }
    }

    if (profileData.alternateMobileTwo) {
      const existing = await vendorProfileRepository.checkAlternateMobileExists(
        profileData.alternateMobileTwo,
        userId
      );
      if (existing) {
        return {
          success: false,
          message: 'Alternate mobile number already in use'
        };
      }
    }

    if (profileData.whatsappMobile) {
      const existing = await vendorProfileRepository.checkAlternateMobileExists(
        profileData.whatsappMobile,
        userId
      );
      if (existing) {
        return {
          success: false,
          message: 'WhatsApp mobile number already in use'
        };
      }
    }

    const updatedProfile = await vendorProfileRepository.updateVendorProfile(userId, profileData);

    return {
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      data: {
        vendorProfile: {
          id: updatedProfile.id,
          businessName: updatedProfile.businessName,
          businessType: updatedProfile.businessType,
          establishmentYear: updatedProfile.establishmentYear,
          yearsOfExperience: updatedProfile.yearsOfExperience,
          teamSize: updatedProfile.teamSize,
          portfolioTagline: updatedProfile.portfolioTagline,
          businessEmail: updatedProfile.businessEmail,
          businessPhone: updatedProfile.businessPhone,
          alternateMobileOne: updatedProfile.alternateMobileOne,
          alternateMobileTwo: updatedProfile.alternateMobileTwo,
          whatsappMobile: updatedProfile.whatsappMobile
        }
      }
    };
  }

  async uploadBusinessLogo(userId, logoPath, storageType) {
    const vendorProfile = await vendorProfileRepository.findByUserId(userId);
    
    if (!vendorProfile) {
      return {
        success: false,
        message: 'Vendor profile not found'
      };
    }

    const oldLogoPath = vendorProfile.getDataValue('businessLogo');

    await vendorProfileRepository.updateBusinessLogo(userId, logoPath, storageType);

    const updatedProfile = await vendorProfileRepository.findByUserId(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_UPLOADED,
      data: {
        businessLogo: updatedProfile.businessLogo
      },
      oldLogoPath
    };
  }

  async uploadBusinessBanner(userId, bannerPath, storageType) {
    const vendorProfile = await vendorProfileRepository.findByUserId(userId);
    
    if (!vendorProfile) {
      return {
        success: false,
        message: 'Vendor profile not found'
      };
    }

    const oldBannerPath = vendorProfile.getDataValue('businessBanner');

    await vendorProfileRepository.updateBusinessBanner(userId, bannerPath, storageType);

    const updatedProfile = await vendorProfileRepository.findByUserId(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_UPLOADED,
      data: {
        businessBanner: updatedProfile.businessBanner
      },
      oldBannerPath
    };
  }

  async deleteBusinessLogo(userId) {
    const vendorProfile = await vendorProfileRepository.findByUserId(userId);
    
    if (!vendorProfile) {
      return {
        success: false,
        message: 'Vendor profile not found'
      };
    }

    const oldLogoPath = vendorProfile.getDataValue('businessLogo');

    await vendorProfileRepository.deleteBusinessLogo(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_DELETED,
      oldLogoPath
    };
  }

  async deleteBusinessBanner(userId) {
    const vendorProfile = await vendorProfileRepository.findByUserId(userId);
    
    if (!vendorProfile) {
      return {
        success: false,
        message: 'Vendor profile not found'
      };
    }

    const oldBannerPath = vendorProfile.getDataValue('businessBanner');

    await vendorProfileRepository.deleteBusinessBanner(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_DELETED,
      oldBannerPath
    };
  }
}

export default new VendorProfileService();
