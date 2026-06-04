import passport from '#config/passport.js';
import { generateAccessToken, generateRefreshToken } from '#utils/jwtHelper.js';
import authRepository from '#repositories/authRepository.js';
import { errorResponse } from '#utils/responseFormatter.js';
import config from '#config/env.js';

class GoogleAuthController {
  static initiateGoogleAuth(req, res, next) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false
    })(req, res, next);
  }

  static async handleGoogleCallback(req, res, next) {
    passport.authenticate('google', { session: false }, async (err, data) => {
      try {
        if (err) {
          console.error('Google OAuth error:', err);
          const frontendUrl = config.app.frontendUrl;
          return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent('Authentication failed')}`);
        }

        if (!data || !data.user) {
          const frontendUrl = config.app.frontendUrl;
          return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent('No user data received')}`);
        }

        const { user, isNewUser } = data;

        const tokenPayload = {
          userId: user.id,
          roleId: user.roleId,
          roleSlug: user.role?.slug || 'consumer',
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

        const frontendUrl = config.app.frontendUrl;
        const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&isNewUser=${isNewUser}`;
        
        return res.redirect(redirectUrl);
      } catch (error) {
        console.error('Google callback error:', error);
        const frontendUrl = config.app.frontendUrl;
        return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent('Authentication processing failed')}`);
      }
    })(req, res, next);
  }
}

export default GoogleAuthController;
