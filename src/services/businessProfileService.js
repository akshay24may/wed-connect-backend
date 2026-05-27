import businessProfileRepository from '#repositories/businessProfileRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class BusinessProfileService {
  async getBusinessProfiles(userId) {
    try {
      const businesses = await businessProfileRepository.findByUserId(userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILES_RETRIEVED,
        data: { businesses }
      };
    } catch (error) {
      console.error('Get business profiles error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.BUSINESS_PROFILES_FETCH_FAILED
      };
    }
  }

  async getBusinessProfile(businessId, userId) {
    try {
      const business = await businessProfileRepository.findByIdAndUserId(businessId, userId);

      if (!business) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_RETRIEVED,
        data: { business }
      };
    } catch (error) {
      console.error('Get business profile error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.BUSINESS_PROFILE_FETCH_FAILED
      };
    }
  }

  async createBusinessProfile(userId, businessData) {
    try {
      if (!businessData.businessName) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_NAME_REQUIRED
        };
      }

      if (businessData.businessName.length < 3) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_NAME_TOO_SHORT
        };
      }

      const data = {
        userId,
        businessName: businessData.businessName,
        businessTagline: businessData.businessTagline,
        businessEmail: businessData.businessEmail,
        businessPhone: businessData.businessPhone,
        contactPersonName: businessData.contactPersonName,
        businessPan: businessData.businessPan,
        gstin: businessData.gstin,
        businessRegistrationNumber: businessData.businessRegistrationNumber,
        businessType: businessData.businessType,
        establishmentYear: businessData.establishmentYear,
        nameOnId: businessData.nameOnId,
        aadharNumber: businessData.aadharNumber,
        panNumber: businessData.panNumber,
        alternateMobileOne: businessData.alternateMobileOne,
        alternateMobileTwo: businessData.alternateMobileTwo,
        whatsappMobile: businessData.whatsappMobile,
        teamDescription: businessData.teamDescription,
        teamSize: businessData.teamSize,
        yearsOfExperience: businessData.yearsOfExperience,
        businessHours: businessData.businessHours,
        certifications: businessData.certifications,
        awards: businessData.awards,
        celebrityWeddingsHandled: businessData.celebrityWeddingsHandled,
        websiteUrl: businessData.websiteUrl,
        facebookUrl: businessData.facebookUrl,
        instagramUrl: businessData.instagramUrl,
        youtubeUrl: businessData.youtubeUrl,
        linkedinUrl: businessData.linkedinUrl
      };

      const business = await businessProfileRepository.create(data, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_CREATED,
        data: { business }
      };
    } catch (error) {
      console.error('Create business profile error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.BUSINESS_PROFILE_CREATE_FAILED
      };
    }
  }

  async updateBusinessProfile(businessId, userId, businessData) {
    try {
      const existingBusiness = await businessProfileRepository.findByIdAndUserId(businessId, userId);

      if (!existingBusiness) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND
        };
      }

      if (businessData.businessName && businessData.businessName.length < 3) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_NAME_TOO_SHORT
        };
      }

      const updateData = {};
      if (businessData.businessName !== undefined) updateData.businessName = businessData.businessName;
      if (businessData.businessTagline !== undefined) updateData.businessTagline = businessData.businessTagline;
      if (businessData.businessEmail !== undefined) updateData.businessEmail = businessData.businessEmail;
      if (businessData.businessPhone !== undefined) updateData.businessPhone = businessData.businessPhone;
      if (businessData.contactPersonName !== undefined) updateData.contactPersonName = businessData.contactPersonName;
      if (businessData.businessPan !== undefined) updateData.businessPan = businessData.businessPan;
      if (businessData.gstin !== undefined) updateData.gstin = businessData.gstin;
      if (businessData.businessRegistrationNumber !== undefined) updateData.businessRegistrationNumber = businessData.businessRegistrationNumber;
      if (businessData.businessType !== undefined) updateData.businessType = businessData.businessType;
      if (businessData.establishmentYear !== undefined) updateData.establishmentYear = businessData.establishmentYear;
      if (businessData.nameOnId !== undefined) updateData.nameOnId = businessData.nameOnId;
      if (businessData.aadharNumber !== undefined) updateData.aadharNumber = businessData.aadharNumber;
      if (businessData.panNumber !== undefined) updateData.panNumber = businessData.panNumber;
      if (businessData.alternateMobileOne !== undefined) updateData.alternateMobileOne = businessData.alternateMobileOne;
      if (businessData.alternateMobileTwo !== undefined) updateData.alternateMobileTwo = businessData.alternateMobileTwo;
      if (businessData.whatsappMobile !== undefined) updateData.whatsappMobile = businessData.whatsappMobile;
      if (businessData.teamDescription !== undefined) updateData.teamDescription = businessData.teamDescription;
      if (businessData.teamSize !== undefined) updateData.teamSize = businessData.teamSize;
      if (businessData.yearsOfExperience !== undefined) updateData.yearsOfExperience = businessData.yearsOfExperience;
      if (businessData.businessHours !== undefined) updateData.businessHours = businessData.businessHours;
      if (businessData.certifications !== undefined) updateData.certifications = businessData.certifications;
      if (businessData.awards !== undefined) updateData.awards = businessData.awards;
      if (businessData.celebrityWeddingsHandled !== undefined) updateData.celebrityWeddingsHandled = businessData.celebrityWeddingsHandled;
      if (businessData.websiteUrl !== undefined) updateData.websiteUrl = businessData.websiteUrl;
      if (businessData.facebookUrl !== undefined) updateData.facebookUrl = businessData.facebookUrl;
      if (businessData.instagramUrl !== undefined) updateData.instagramUrl = businessData.instagramUrl;
      if (businessData.youtubeUrl !== undefined) updateData.youtubeUrl = businessData.youtubeUrl;
      if (businessData.linkedinUrl !== undefined) updateData.linkedinUrl = businessData.linkedinUrl;

      const business = await businessProfileRepository.update(businessId, updateData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_UPDATED,
        data: { business }
      };
    } catch (error) {
      console.error('Update business profile error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.BUSINESS_PROFILE_UPDATE_FAILED
      };
    }
  }

  async deleteBusinessProfile(businessId, userId) {
    try {
      const business = await businessProfileRepository.findByIdAndUserId(businessId, userId);

      if (!business) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND
        };
      }

      await businessProfileRepository.delete(businessId, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_PROFILE_DELETED
      };
    } catch (error) {
      console.error('Delete business profile error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.BUSINESS_PROFILE_DELETE_FAILED
      };
    }
  }

  async uploadBusinessMedia(businessId, userId, files) {
    try {
      const business = await businessProfileRepository.findByIdAndUserId(businessId, userId);

      if (!business) {
        return {
          success: false,
          message: ERROR_MESSAGES.BUSINESS_PROFILE_NOT_FOUND
        };
      }

      const mediaData = {};
      const uploadedFiles = [];

      for (const file of files) {
        if (file.fieldname === 'logo') {
          mediaData.businessLogo = file.path;
          uploadedFiles.push({ type: 'logo', url: file.path });
        } else if (file.fieldname === 'banner') {
          mediaData.businessBanner = file.path;
          uploadedFiles.push({ type: 'banner', url: file.path });
        }
      }

      if (Object.keys(mediaData).length > 0) {
        const storageType = process.env.STORAGE_TYPE || 'local';
        mediaData.businessMediaStorageType = storageType;

        await businessProfileRepository.updateMedia(businessId, mediaData, userId);
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.BUSINESS_MEDIA_UPLOADED,
        data: { uploadedFiles }
      };
    } catch (error) {
      console.error('Upload business media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.BUSINESS_MEDIA_UPLOAD_FAILED
      };
    }
  }
}

export default new BusinessProfileService();
