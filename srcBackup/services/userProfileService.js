import userProfileRepository from '#repositories/userProfileRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class UserProfileService {
  async getProfile(userId) {
    const user = await userProfileRepository.findUserById(userId);
    
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.DATA_RETRIEVED,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          mobile: user.mobile,
          email: user.email,
          dob: user.dob,
          gender: user.gender,
          about: user.about,
          profilePhoto: user.profilePhoto,
          avatarPhoto: user.avatarPhoto,
          address: user.address,
          cityId: user.cityId,
          cityName: user.cityName,
          stateId: user.stateId,
          stateName: user.stateName,
          countryName: user.countryName,
          pincode: user.pincode,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          isProfileComplete: user.isProfileComplete,
          roleSlug: user.role?.slug
        }
      }
    };
  }

  async updateProfile(userId, profileData) {
    const user = await userProfileRepository.findUserById(userId);
    
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    if (profileData.email && profileData.email !== user.email) {
      const existingEmail = await userProfileRepository.findUserByEmail(profileData.email);
      if (existingEmail && existingEmail.id !== userId) {
        return {
          success: false,
          message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        };
      }
    }

    const updatedUser = await userProfileRepository.updateUser(userId, profileData);

    return {
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      data: {
        user: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          mobile: updatedUser.mobile,
          email: updatedUser.email,
          dob: updatedUser.dob,
          gender: updatedUser.gender,
          about: updatedUser.about,
          address: updatedUser.address,
          cityId: updatedUser.cityId,
          cityName: updatedUser.cityName,
          stateId: updatedUser.stateId,
          stateName: updatedUser.stateName,
          pincode: updatedUser.pincode
        }
      }
    };
  }

  async uploadProfilePhoto(userId, photoPath, storageType) {
    const user = await userProfileRepository.findUserById(userId);
    
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    const oldPhotoPath = user.getDataValue('profilePhoto');

    await userProfileRepository.updateProfilePhoto(userId, photoPath, storageType);

    const updatedUser = await userProfileRepository.findUserById(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_UPLOADED,
      data: {
        profilePhoto: updatedUser.profilePhoto
      },
      oldPhotoPath
    };
  }

  async uploadAvatarPhoto(userId, photoPath, storageType) {
    const user = await userProfileRepository.findUserById(userId);
    
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    const oldAvatarPath = user.getDataValue('avatarPhoto');

    await userProfileRepository.updateAvatarPhoto(userId, photoPath, storageType);

    const updatedUser = await userProfileRepository.findUserById(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_UPLOADED,
      data: {
        avatarPhoto: updatedUser.avatarPhoto
      },
      oldAvatarPath
    };
  }

  async deleteProfilePhoto(userId) {
    const user = await userProfileRepository.findUserById(userId);
    
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    const oldPhotoPath = user.getDataValue('profilePhoto');

    await userProfileRepository.deleteProfilePhoto(userId);

    return {
      success: true,
      message: SUCCESS_MESSAGES.FILE_DELETED,
      oldPhotoPath
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userProfileRepository.findUserById(userId);
    
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      };
    }

    await userProfileRepository.updatePassword(userId, newPassword);

    return {
      success: true,
      message: SUCCESS_MESSAGES.PASSWORD_CHANGED
    };
  }
}

export default new UserProfileService();
