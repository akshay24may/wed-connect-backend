/**
 * Standardized message constants for API responses
 * Use these constants throughout the application for consistent messaging
 */

export const SUCCESS_MESSAGES = {
  BUSINESS_PROFILES_RETRIEVED: 'Business profiles retrieved successfully',
  BUSINESS_PROFILE_RETRIEVED: 'Business profile retrieved successfully',
  BUSINESS_PROFILE_CREATED: 'Business profile created successfully',
  BUSINESS_PROFILE_UPDATED: 'Business profile updated successfully',
  BUSINESS_PROFILE_DELETED: 'Business profile deleted successfully'
};

export const ERROR_MESSAGES = {
  BUSINESS_PROFILES_FETCH_FAILED: 'Failed to fetch business profiles',
  BUSINESS_PROFILE_FETCH_FAILED: 'Failed to fetch business profile',
  BUSINESS_PROFILE_NOT_FOUND: 'Business profile not found',
  BUSINESS_PROFILE_CREATE_FAILED: 'Failed to create business profile',
  BUSINESS_PROFILE_UPDATE_FAILED: 'Failed to update business profile',
  BUSINESS_PROFILE_DELETE_FAILED: 'Failed to delete business profile',
  BUSINESS_NAME_REQUIRED: 'Business name is required',
  BUSINESS_NAME_TOO_SHORT: 'Business name must be at least 3 characters'
};
