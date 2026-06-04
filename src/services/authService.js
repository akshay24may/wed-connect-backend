import authRepository from '#repositories/authRepository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '#utils/jwtHelper.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';
import crypto from 'crypto';

class AuthService {
  async register(registerData) {
    const { mobile, fullName, password, roleSlug, email } = registerData;

    const existingUser = await authRepository.findUserByMobile(mobile);
    if (existingUser) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_ALREADY_EXISTS
      };
    }

    if (email) {
      const existingEmail = await authRepository.findUserByEmail(email);
      if (existingEmail) {
        return {
          success: false,
          message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        };
      }
    }

    const role = await authRepository.findRoleBySlug(roleSlug || 'consumer');
    if (!role) {
      return {
        success: false,
        message: 'Invalid role specified'
      };
    }

    const user = await authRepository.createUser({
      fullName,
      mobile,
      email,
      password,
      roleId: role.id,
      isPhoneVerified: false
    });

    if (role.slug === 'vendor') {
      await authRepository.createBusinessProfile({
        userId: user.id,
        businessName: fullName
      });
    }

    const tokenPayload = {
      userId: user.id,
      roleId: role.id,
      roleSlug: role.slug,
      mobile: user.mobile,
      email: user.email
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await authRepository.createSession({
      userId: user.id,
      refreshToken,
      expiresAt
    });

    await authRepository.updateLastLogin(user.id);

    return {
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          mobile: user.mobile,
          email: user.email,
          roleSlug: role.slug
        },
        accessToken,
        refreshToken
      }
    };
  }

  async login(loginData) {
    const { mobile, password } = loginData;

    const user = await authRepository.findUserByMobile(mobile);
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: ERROR_MESSAGES.ACCOUNT_SUSPENDED
      };
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      };
    }

    const tokenPayload = {
      userId: user.id,
      roleId: user.roleId,
      roleSlug: user.role.slug,
      mobile: user.mobile,
      email: user.email
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await authRepository.createSession({
      userId: user.id,
      refreshToken,
      expiresAt
    });

    await authRepository.updateLastLogin(user.id);

    return {
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          mobile: user.mobile,
          email: user.email,
          roleSlug: user.role.slug,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified
        },
        accessToken,
        refreshToken
      }
    };
  }

  async refreshToken(refreshTokenData) {
    const { refreshToken } = refreshTokenData;

    try {
      const decoded = verifyRefreshToken(refreshToken);

      const session = await authRepository.findSessionByRefreshToken(refreshToken);
      if (!session || !session.isActive) {
        return {
          success: false,
          message: ERROR_MESSAGES.TOKEN_INVALID
        };
      }

      const user = await authRepository.findUserById(decoded.userId);
      if (!user || !user.isActive) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        };
      }

      const tokenPayload = {
        userId: user.id,
        roleId: user.roleId,
        roleSlug: user.role.slug,
        mobile: user.mobile,
        email: user.email
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      await authRepository.invalidateSession(refreshToken);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await authRepository.createSession({
        userId: user.id,
        refreshToken: newRefreshToken,
        expiresAt
      });

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      return {
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID
      };
    }
  }

  async logout(userId, refreshToken) {
    if (refreshToken) {
      await authRepository.invalidateSession(refreshToken);
    } else {
      await authRepository.invalidateAllUserSessions(userId);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
    };
  }

  async requestOtp(otpData) {
    const { mobile, email, type, channel } = otpData;

    if (!mobile && !email) {
      return {
        success: false,
        message: 'Mobile or email is required'
      };
    }

    if (channel === 'email' && !email) {
      return {
        success: false,
        message: 'Email is required for email channel'
      };
    }

    const user = mobile 
      ? await authRepository.findUserByMobile(mobile)
      : await authRepository.findUserByEmail(email);
    
    if (type === 'login' && !user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    if (type === 'signup' && user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_ALREADY_EXISTS
      };
    }

    if (type === 'password_reset' && !user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const otpRecord = await authRepository.createOtp({
      mobile: mobile || null,
      email: email || null,
      otp,
      type,
      channel: channel || 'sms',
      expiresAt
    });

    console.log(`OTP for ${mobile || email} (${channel || 'sms'}): ${otp}`);

    return {
      success: true,
      message: SUCCESS_MESSAGES.OTP_SENT,
      data: {
        expiresAt: otpRecord.expiresAt
      }
    };
  }

  async verifyOtp(verifyData) {
    const { mobile, email, otp, type } = verifyData;

    const otpRecord = await authRepository.findValidOtp(mobile || email, type);
    
    if (!otpRecord) {
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_NOT_FOUND
      };
    }

    if (otpRecord.isVerified) {
      return {
        success: false,
        message: 'OTP already verified'
      };
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_EXPIRED
      };
    }

    if (otpRecord.attempts >= 5) {
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_MAX_ATTEMPTS
      };
    }

    if (otpRecord.otp !== otp) {
      await authRepository.incrementOtpAttempts(otpRecord.id);
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_INVALID
      };
    }

    await authRepository.markOtpAsVerified(otpRecord.id);

    const user = mobile 
      ? await authRepository.findUserByMobile(mobile)
      : await authRepository.findUserByEmail(email);
    
    if (user) {
      if (mobile) {
        await authRepository.markPhoneAsVerified(user.id);
      } else if (email) {
        await authRepository.markEmailAsVerified(user.id);
      }

      const tokenPayload = {
        userId: user.id,
        roleId: user.roleId,
        roleSlug: user.role.slug,
        mobile: user.mobile,
        email: user.email
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await authRepository.createSession({
        userId: user.id,
        refreshToken,
        expiresAt
      });

      await authRepository.updateLastLogin(user.id);

      return {
        success: true,
        message: SUCCESS_MESSAGES.OTP_VERIFIED,
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            mobile: user.mobile,
            email: user.email,
            roleSlug: user.role.slug
          },
          accessToken,
          refreshToken
        }
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.OTP_VERIFIED,
      data: null
    };
  }

  async resetPassword(resetData) {
    const { mobile, otp, newPassword } = resetData;

    const otpRecord = await authRepository.findValidOtp(mobile, 'password_reset');
    
    if (!otpRecord) {
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_NOT_FOUND
      };
    }

    if (otpRecord.isVerified) {
      return {
        success: false,
        message: 'OTP already used'
      };
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_EXPIRED
      };
    }

    if (otpRecord.otp !== otp) {
      await authRepository.incrementOtpAttempts(otpRecord.id);
      return {
        success: false,
        message: ERROR_MESSAGES.OTP_INVALID
      };
    }

    const user = await authRepository.findUserByMobile(mobile);
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      };
    }

    await authRepository.updatePassword(user.id, newPassword);
    await authRepository.markOtpAsVerified(otpRecord.id);
    await authRepository.invalidateAllUserSessions(user.id);

    return {
      success: true,
      message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
    };
  }
}

export default new AuthService();
