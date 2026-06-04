import models from '#models/index.js';
import bcrypt from 'bcrypt';

const { User, Role, UserSession, OtpVerification, BusinessProfile } = models;

class AuthRepository {
  async findUserByMobile(mobile) {
    return await User.findOne({
      where: { mobile },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
  }

  async findUserByEmail(email) {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
  }

  async findUserById(userId) {
    return await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
  }

  async findRoleBySlug(slug) {
    return await Role.findOne({
      where: { slug, isActive: true }
    });
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return await User.create({
      fullName: userData.fullName,
      mobile: userData.mobile,
      countryCode: userData.countryCode || '+91',
      email: userData.email || null,
      passwordHash: hashedPassword,
      roleId: userData.roleId,
      isActive: true,
      isPhoneVerified: userData.isPhoneVerified || false,
      isEmailVerified: false,
      isProfileComplete: false
    });
  }

  async updateLastLogin(userId) {
    return await User.update(
      { lastLoginAt: new Date() },
      { where: { id: userId } }
    );
  }

  async createSession(sessionData) {
    return await UserSession.create({
      userId: sessionData.userId,
      refreshToken: sessionData.refreshToken,
      deviceName: sessionData.deviceInfo || null,
      ipAddressV4: sessionData.ipAddress || null,
      expiresAt: sessionData.expiresAt,
      isActive: true
    });
  }

  async findSessionByRefreshToken(refreshToken) {
    return await UserSession.findOne({
      where: { refreshToken, isActive: true }
    });
  }

  async invalidateSession(refreshToken) {
    return await UserSession.update(
      { isActive: false },
      { where: { refreshToken } }
    );
  }

  async invalidateAllUserSessions(userId) {
    return await UserSession.update(
      { isActive: false },
      { where: { userId } }
    );
  }

  async createOtp(otpData) {
    return await OtpVerification.create({
      mobile: otpData.mobile,
      email: otpData.email || null,
      otp: otpData.otp,
      type: otpData.type,
      channel: otpData.channel || 'sms',
      expiresAt: otpData.expiresAt,
      isVerified: false,
      attempts: 0
    });
  }

  async findOtpById(otpId) {
    return await OtpVerification.findByPk(otpId);
  }

  async findValidOtp(identifier, type) {
    const where = {
      type,
      isVerified: false,
      expiresAt: {
        [models.Sequelize.Op.gt]: new Date()
      }
    };

    if (identifier.includes('@')) {
      where.email = identifier;
    } else {
      where.mobile = identifier;
    }

    return await OtpVerification.findOne({
      where,
      order: [['created_at', 'DESC']]
    });
  }

  async incrementOtpAttempts(otpId) {
    const otp = await OtpVerification.findByPk(otpId);
    if (otp) {
      otp.attempts += 1;
      await otp.save();
    }
    return otp;
  }

  async markOtpAsVerified(otpId) {
    return await OtpVerification.update(
      { isVerified: true, verifiedAt: new Date() },
      { where: { id: otpId } }
    );
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.update(
      { passwordHash: hashedPassword },
      { where: { id: userId } }
    );
  }

  async markPhoneAsVerified(userId) {
    return await User.update(
      { 
        isPhoneVerified: true,
        phoneVerifiedAt: new Date()
      },
      { where: { id: userId } }
    );
  }

  async markEmailAsVerified(userId) {
    return await User.update(
      { 
        isEmailVerified: true,
        emailVerifiedAt: new Date()
      },
      { where: { id: userId } }
    );
  }

  async createBusinessProfile(vendorData) {
    return await BusinessProfile.create(vendorData);
  }
}

export default new AuthRepository();
