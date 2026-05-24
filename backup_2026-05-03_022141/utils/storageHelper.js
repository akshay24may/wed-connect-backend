/**
 * Storage Helper Utility
 * Handles conversion between relative and absolute file paths/URLs
 * Supports local and Cloudinary storage
 */

import path from 'path';
import { cloudinary } from '#config/storageConfig.js';

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'eclassify_app';

/**
 * Convert relative path (with extension) to absolute URL
 * @param {string} relativePath - Relative path with extension (e.g., 'uploads/portfolios/user-123/photo.jpeg')
 * @param {string} storageType - Storage type: 'local', 'cloudinary', 'aws_s3', etc.
 * @returns {string|null} - Absolute URL or null if no path provided
 */
export const getFullUrl = (relativePath, storageType) => {
  if (!relativePath) return null;

  // Cloudinary storage
  if (storageType === 'cloudinary') {
    // Extract path without extension for Cloudinary public_id
    const pathWithoutExt = relativePath.replace(/\.[^.]+$/, '');
    const ext = path.extname(relativePath).substring(1); // .jpg -> jpg
    const fullPublicId = `${CLOUDINARY_FOLDER}/${pathWithoutExt}`;
    return cloudinary.url(fullPublicId, { 
      format: ext,
      secure: true 
    });
  }

  // Local/S3/R2/other storage - use path as-is
  return `${process.env.UPLOAD_URL}/${relativePath}`;
};

/**
 * Convert absolute file system path to relative path for database storage
 * @param {string} absolutePath - Absolute file system path
 * @returns {string} - Relative path with forward slashes and extension (e.g., 'uploads/portfolios/user-123/photo.jpeg')
 */
export const getRelativePath = (absolutePath) => {
  return path.relative(process.cwd(), absolutePath).replace(/\\/g, '/');
};

/**
 * Convert multiple relative paths to absolute URLs
 * @param {Array<string>} relativePaths - Array of relative paths
 * @returns {Array<string>} - Array of absolute URLs
 */
export const getFullUrls = (relativePaths) => {
  if (!Array.isArray(relativePaths)) return [];
  return relativePaths.map(getFullUrl).filter(Boolean);
};
