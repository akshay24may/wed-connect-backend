import vendorProfileService from '#services/vendorProfileService.js';
import {
  successResponse,
  errorResponse,
  validationErrorResponse
} from '#utils/responseFormatter.js';
// import { uploadSingle, deleteFile } from '#uploads/uploadMiddleware.js';
import config from '#config/env.js';

class VendorProfileController {
  static async getVendorProfile(req, res) {
    try {
      const userId = req.user.userId;

      const result = await vendorProfileService.getVendorProfile(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get vendor profile error:', error);
      return errorResponse(res, 'Failed to retrieve vendor profile', 500);
    }
  }

  static async updateVendorProfile(req, res) {
    try {
      const userId = req.user.userId;
      const {
        businessName,
        businessPan,
        gstin,
        businessRegistrationNumber,
        businessType,
        establishmentYear,
        nameOnId,
        aadharNumber,
        panNumber,
        alternateMobileOne,
        alternateMobileTwo,
        whatsappMobile,
        yearsOfExperience,
        teamSize,
        portfolioTagline,
        specializations,
        serviceAreas,
        certifications,
        awards,
        businessEmail,
        businessPhone,
        websiteUrl,
        facebookUrl,
        instagramUrl,
        youtubeUrl,
        linkedinUrl,
        businessHours,
        acceptsAdvanceBooking,
        minAdvanceBookingDays,
        cancellationPolicy
      } = req.body;

      const profileData = {};
      if (businessName !== undefined) profileData.businessName = businessName;
      if (businessPan !== undefined) profileData.businessPan = businessPan;
      if (gstin !== undefined) profileData.gstin = gstin;
      if (businessRegistrationNumber !== undefined) profileData.businessRegistrationNumber = businessRegistrationNumber;
      if (businessType !== undefined) profileData.businessType = businessType;
      if (establishmentYear !== undefined) profileData.establishmentYear = establishmentYear;
      if (nameOnId !== undefined) profileData.nameOnId = nameOnId;
      if (aadharNumber !== undefined) profileData.aadharNumber = aadharNumber;
      if (panNumber !== undefined) profileData.panNumber = panNumber;
      if (alternateMobileOne !== undefined) profileData.alternateMobileOne = alternateMobileOne;
      if (alternateMobileTwo !== undefined) profileData.alternateMobileTwo = alternateMobileTwo;
      if (whatsappMobile !== undefined) profileData.whatsappMobile = whatsappMobile;
      if (yearsOfExperience !== undefined) profileData.yearsOfExperience = yearsOfExperience;
      if (teamSize !== undefined) profileData.teamSize = teamSize;
      if (portfolioTagline !== undefined) profileData.portfolioTagline = portfolioTagline;
      if (specializations !== undefined) profileData.specializations = specializations;
      if (serviceAreas !== undefined) profileData.serviceAreas = serviceAreas;
      if (certifications !== undefined) profileData.certifications = certifications;
      if (awards !== undefined) profileData.awards = awards;
      if (businessEmail !== undefined) profileData.businessEmail = businessEmail;
      if (businessPhone !== undefined) profileData.businessPhone = businessPhone;
      if (websiteUrl !== undefined) profileData.websiteUrl = websiteUrl;
      if (facebookUrl !== undefined) profileData.facebookUrl = facebookUrl;
      if (instagramUrl !== undefined) profileData.instagramUrl = instagramUrl;
      if (youtubeUrl !== undefined) profileData.youtubeUrl = youtubeUrl;
      if (linkedinUrl !== undefined) profileData.linkedinUrl = linkedinUrl;
      if (businessHours !== undefined) profileData.businessHours = businessHours;
      if (acceptsAdvanceBooking !== undefined) profileData.acceptsAdvanceBooking = acceptsAdvanceBooking;
      if (minAdvanceBookingDays !== undefined) profileData.minAdvanceBookingDays = minAdvanceBookingDays;
      if (cancellationPolicy !== undefined) profileData.cancellationPolicy = cancellationPolicy;

      const result = await vendorProfileService.updateVendorProfile(userId, profileData);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message, 'UPDATED');
    } catch (error) {
      console.error('Update vendor profile error:', error);
      return errorResponse(res, 'Failed to update vendor profile', 500);
    }
  }

  static async uploadBusinessLogo(req, res) {
    try {
      const userId = req.user.userId;

      const upload = uploadSingle('vendors', 'logo', {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      upload(req, res, async (err) => {
        if (err) {
          return validationErrorResponse(res, null, err.message);
        }

        if (!req.file) {
          return validationErrorResponse(res, null, 'Logo file is required');
        }

        const logoPath = req.file.path;
        const storageType = config.storage.type;

        const result = await vendorProfileService.uploadBusinessLogo(userId, logoPath, storageType);

        if (!result.success) {
          if (logoPath) {
            await deleteFile(logoPath);
          }
          return errorResponse(res, result.message, 400);
        }

        if (result.oldLogoPath) {
          await deleteFile(result.oldLogoPath);
        }

        return successResponse(res, result.data, result.message);
      });
    } catch (error) {
      console.error('Upload business logo error:', error);
      return errorResponse(res, 'Failed to upload business logo', 500);
    }
  }

  static async uploadBusinessBanner(req, res) {
    try {
      const userId = req.user.userId;

      const upload = uploadSingle('vendors', 'banner', {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      upload(req, res, async (err) => {
        if (err) {
          return validationErrorResponse(res, null, err.message);
        }

        if (!req.file) {
          return validationErrorResponse(res, null, 'Banner file is required');
        }

        const bannerPath = req.file.path;
        const storageType = config.storage.type;

        const result = await vendorProfileService.uploadBusinessBanner(userId, bannerPath, storageType);

        if (!result.success) {
          if (bannerPath) {
            await deleteFile(bannerPath);
          }
          return errorResponse(res, result.message, 400);
        }

        if (result.oldBannerPath) {
          await deleteFile(result.oldBannerPath);
        }

        return successResponse(res, result.data, result.message);
      });
    } catch (error) {
      console.error('Upload business banner error:', error);
      return errorResponse(res, 'Failed to upload business banner', 500);
    }
  }

  static async deleteBusinessLogo(req, res) {
    try {
      const userId = req.user.userId;

      const result = await vendorProfileService.deleteBusinessLogo(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      if (result.oldLogoPath) {
        await deleteFile(result.oldLogoPath);
      }

      return successResponse(res, null, result.message, 'DELETED');
    } catch (error) {
      console.error('Delete business logo error:', error);
      return errorResponse(res, 'Failed to delete business logo', 500);
    }
  }

  static async deleteBusinessBanner(req, res) {
    try {
      const userId = req.user.userId;

      const result = await vendorProfileService.deleteBusinessBanner(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      if (result.oldBannerPath) {
        await deleteFile(result.oldBannerPath);
      }

      return successResponse(res, null, result.message, 'DELETED');
    } catch (error) {
      console.error('Delete business banner error:', error);
      return errorResponse(res, 'Failed to delete business banner', 500);
    }
  }
}

export default VendorProfileController;
