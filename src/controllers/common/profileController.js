import userProfileService from '#services/userProfileService.js';
import {
  successResponse,
  errorResponse,
  validationErrorResponse
} from '#utils/responseFormatter.js';
import { uploadSingle, deleteFile } from '#uploads/uploadMiddleware.js';
import config from '#config/env.js';

class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const result = await userProfileService.getProfile(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get profile error:', error);
      return errorResponse(res, 'Failed to retrieve profile', 500);
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const {
        fullName,
        email,
        dob,
        gender,
        about,
        address,
        cityId,
        cityName,
        stateId,
        stateName,
        countryName,
        pincode
      } = req.body;

      const profileData = {};
      if (fullName !== undefined) profileData.fullName = fullName;
      if (email !== undefined) profileData.email = email;
      if (dob !== undefined) profileData.dob = dob;
      if (gender !== undefined) profileData.gender = gender;
      if (about !== undefined) profileData.about = about;
      if (address !== undefined) profileData.address = address;
      if (cityId !== undefined) profileData.cityId = cityId;
      if (cityName !== undefined) profileData.cityName = cityName;
      if (stateId !== undefined) profileData.stateId = stateId;
      if (stateName !== undefined) profileData.stateName = stateName;
      if (countryName !== undefined) profileData.countryName = countryName;
      if (pincode !== undefined) profileData.pincode = pincode;

      const result = await userProfileService.updateProfile(userId, profileData);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message, 'UPDATED');
    } catch (error) {
      console.error('Update profile error:', error);
      return errorResponse(res, 'Failed to update profile', 500);
    }
  }

  static async uploadProfilePhoto(req, res) {
    try {
      const userId = req.user.userId;

      const upload = uploadSingle('profiles', 'photo', {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      upload(req, res, async (err) => {
        if (err) {
          return validationErrorResponse(res, null, err.message);
        }

        if (!req.file) {
          return validationErrorResponse(res, null, 'Photo file is required');
        }

        const photoPath = req.file.path;
        const storageType = config.storage.type;

        const result = await userProfileService.uploadProfilePhoto(userId, photoPath, storageType);

        if (!result.success) {
          if (photoPath) {
            await deleteFile(photoPath);
          }
          return errorResponse(res, result.message, 400);
        }

        if (result.oldPhotoPath) {
          await deleteFile(result.oldPhotoPath);
        }

        return successResponse(res, result.data, result.message);
      });
    } catch (error) {
      console.error('Upload profile photo error:', error);
      return errorResponse(res, 'Failed to upload profile photo', 500);
    }
  }

  static async uploadAvatarPhoto(req, res) {
    try {
      const userId = req.user.userId;

      const upload = uploadSingle('profiles', 'avatar', {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });

      upload(req, res, async (err) => {
        if (err) {
          return validationErrorResponse(res, null, err.message);
        }

        if (!req.file) {
          return validationErrorResponse(res, null, 'Avatar file is required');
        }

        const photoPath = req.file.path;
        const storageType = config.storage.type;

        const result = await userProfileService.uploadAvatarPhoto(userId, photoPath, storageType);

        if (!result.success) {
          if (photoPath) {
            await deleteFile(photoPath);
          }
          return errorResponse(res, result.message, 400);
        }

        if (result.oldAvatarPath) {
          await deleteFile(result.oldAvatarPath);
        }

        return successResponse(res, result.data, result.message);
      });
    } catch (error) {
      console.error('Upload avatar photo error:', error);
      return errorResponse(res, 'Failed to upload avatar photo', 500);
    }
  }

  static async deleteProfilePhoto(req, res) {
    try {
      const userId = req.user.userId;

      const result = await userProfileService.deleteProfilePhoto(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      if (result.oldPhotoPath) {
        await deleteFile(result.oldPhotoPath);
      }

      return successResponse(res, null, result.message, 'DELETED');
    } catch (error) {
      console.error('Delete profile photo error:', error);
      return errorResponse(res, 'Failed to delete profile photo', 500);
    }
  }

  static async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return validationErrorResponse(res, null, 'Current password and new password are required');
      }

      if (newPassword.length < 6) {
        return validationErrorResponse(res, null, 'New password must be at least 6 characters long');
      }

      const result = await userProfileService.changePassword(userId, currentPassword, newPassword);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message, 'UPDATED');
    } catch (error) {
      console.error('Change password error:', error);
      return errorResponse(res, 'Failed to change password', 500);
    }
  }
}

export default ProfileController;
