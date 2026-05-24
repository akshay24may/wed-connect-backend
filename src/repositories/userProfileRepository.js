import models from '#models/index.js';
import bcrypt from 'bcrypt';

const { User, Role, City, State } = models;

class UserProfileRepository {
  async findUserById(userId) {
    return await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'cityTier']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'name']
        }
      ]
    });
  }

  async findUserByEmail(email) {
    return await User.findOne({
      where: { email }
    });
  }

  async updateUser(userId, userData) {
    const updateData = {};

    if (userData.fullName !== undefined) updateData.fullName = userData.fullName;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.dob !== undefined) updateData.dob = userData.dob;
    if (userData.gender !== undefined) updateData.gender = userData.gender;
    if (userData.about !== undefined) updateData.about = userData.about;
    if (userData.address !== undefined) updateData.address = userData.address;
    if (userData.cityId !== undefined) updateData.cityId = userData.cityId;
    if (userData.cityName !== undefined) updateData.cityName = userData.cityName;
    if (userData.stateId !== undefined) updateData.stateId = userData.stateId;
    if (userData.stateName !== undefined) updateData.stateName = userData.stateName;
    if (userData.countryName !== undefined) updateData.countryName = userData.countryName;
    if (userData.pincode !== undefined) updateData.pincode = userData.pincode;

    await User.update(updateData, {
      where: { id: userId }
    });

    return await this.findUserById(userId);
  }

  async updateProfilePhoto(userId, photoPath, storageType) {
    return await User.update(
      {
        profilePhoto: photoPath,
        photosStorageType: storageType
      },
      { where: { id: userId } }
    );
  }

  async updateAvatarPhoto(userId, photoPath, storageType) {
    return await User.update(
      {
        avatarPhoto: photoPath,
        photosStorageType: storageType
      },
      { where: { id: userId } }
    );
  }

  async deleteProfilePhoto(userId) {
    return await User.update(
      {
        profilePhoto: null
      },
      { where: { id: userId } }
    );
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.update(
      { passwordHash: hashedPassword },
      { where: { id: userId } }
    );
  }
}

export default new UserProfileRepository();
