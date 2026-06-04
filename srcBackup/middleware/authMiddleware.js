import { verifyAccessToken } from '#utils/jwtHelper.js';
import { unauthorizedResponse, forbiddenResponse } from '#utils/responseFormatter.js';
import { ERROR_MESSAGES } from '#utils/constants/messages.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message.includes('expired')) {
        return unauthorizedResponse(res, ERROR_MESSAGES.TOKEN_EXPIRED);
      }
      return unauthorizedResponse(res, ERROR_MESSAGES.TOKEN_INVALID);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.roleSlug)) {
      return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    next();
  };
};

export const requireAnyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const hasRole = allowedRoles.some(role => req.user.roleSlug === role);
    
    if (!hasRole) {
      return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    next();
  };
};

export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.roleSlug !== 'super_admin') {
    return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  const adminRoles = ['super_admin', 'admin'];
  if (!adminRoles.includes(req.user.roleSlug)) {
    return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  next();
};

export const isPanelUser = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  const panelRoles = ['super_admin', 'admin', 'marketing', 'seo', 'accountant'];
  if (!panelRoles.includes(req.user.roleSlug)) {
    return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  next();
};

export const isVendor = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.roleSlug !== 'vendor') {
    return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  next();
};

export const isConsumer = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.roleSlug !== 'consumer') {
    return forbiddenResponse(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  next();
};
