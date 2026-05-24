import authService from '#services/authService.js';
import {
  successResponse,
  createResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse
} from '#utils/responseFormatter.js';

class AuthController {
  static async register(req, res) {
    try {
      const { mobile, fullName, password, roleSlug, email } = req.body;

      if (!mobile || !fullName || !password) {
        return validationErrorResponse(res, null, 'Mobile, full name, and password are required');
      }

      if (password.length < 6) {
        return validationErrorResponse(res, null, 'Password must be at least 6 characters long');
      }

      const result = await authService.register({
        mobile,
        fullName,
        password,
        roleSlug: roleSlug || 'consumer',
        email
      });

      if (!result.success) {
        return errorResponse(res, result.message, 400, 'REGISTRATION_FAILED');
      }

      return createResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Register error:', error);
      return errorResponse(res, 'Registration failed', 500);
    }
  }

  static async login(req, res) {
    try {
      const { mobile, password } = req.body;

      if (!mobile || !password) {
        return validationErrorResponse(res, null, 'Mobile and password are required');
      }

      const result = await authService.login({ mobile, password });

      if (!result.success) {
        return unauthorizedResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Login error:', error);
      return errorResponse(res, 'Login failed', 500);
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return validationErrorResponse(res, null, 'Refresh token is required');
      }

      const result = await authService.refreshToken({ refreshToken });

      if (!result.success) {
        return unauthorizedResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Refresh token error:', error);
      return errorResponse(res, 'Token refresh failed', 500);
    }
  }

  static async logout(req, res) {
    try {
      const userId = req.user.userId;
      const refreshToken = req.body.refreshToken || null;

      const result = await authService.logout(userId, refreshToken);

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Logout error:', error);
      return errorResponse(res, 'Logout failed', 500);
    }
  }

  static async requestOtp(req, res) {
    try {
      const { mobile, email, type, channel } = req.body;

      if (!mobile && !email) {
        return validationErrorResponse(res, null, 'Mobile or email is required');
      }

      if (!type) {
        return validationErrorResponse(res, null, 'Type is required');
      }

      if (!['login', 'signup', 'verification', 'password_reset'].includes(type)) {
        return validationErrorResponse(res, null, 'Invalid OTP type');
      }

      if (channel && !['sms', 'whatsapp', 'email'].includes(channel)) {
        return validationErrorResponse(res, null, 'Invalid channel. Use: sms, whatsapp, or email');
      }

      if (channel === 'email' && !email) {
        return validationErrorResponse(res, null, 'Email is required for email channel');
      }

      const result = await authService.requestOtp({ mobile, email, type, channel: channel || 'sms' });

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Request OTP error:', error);
      return errorResponse(res, 'Failed to send OTP', 500);
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { mobile, email, otp, type } = req.body;

      if (!mobile && !email) {
        return validationErrorResponse(res, null, 'Mobile or email is required');
      }

      if (!otp) {
        return validationErrorResponse(res, null, 'OTP is required');
      }

      if (!type) {
        return validationErrorResponse(res, null, 'Type is required');
      }

      if (!['login', 'signup', 'verification', 'password_reset'].includes(type)) {
        return validationErrorResponse(res, null, 'Invalid OTP type');
      }

      const result = await authService.verifyOtp({ mobile, email, otp, type });

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Verify OTP error:', error);
      return errorResponse(res, 'OTP verification failed', 500);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { mobile, otp, newPassword } = req.body;

      if (!mobile || !otp || !newPassword) {
        return validationErrorResponse(res, null, 'Mobile, OTP, and new password are required');
      }

      if (newPassword.length < 6) {
        return validationErrorResponse(res, null, 'Password must be at least 6 characters long');
      }

      const result = await authService.resetPassword({
        mobile,
        otp,
        newPassword
      });

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Reset password error:', error);
      return errorResponse(res, 'Password reset failed', 500);
    }
  }
}

export default AuthController;
