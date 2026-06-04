import path from 'path';
import config from '#config/env.js';

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'wedconnect_app';

export const getFullUrl = (relativePath, storageType) => {
  if (!relativePath) return null;

  if (storageType === 'cloudinary') {
    const pathWithoutExt = relativePath.replace(/\.[^.]+$/, '');
    const ext = path.extname(relativePath).substring(1);
    const fullPublicId = `${CLOUDINARY_FOLDER}/${pathWithoutExt}`;
    
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${fullPublicId}.${ext}`;
  }

  const uploadUrl = process.env.UPLOAD_URL || config.upload?.baseUrl || 'http://localhost:5000';
  return `${uploadUrl}/${relativePath}`;
};

export const getRelativePath = (absolutePath) => {
  return path.relative(process.cwd(), absolutePath).replace(/\\/g, '/');
};

export const getFullUrls = (relativePaths) => {
  if (!Array.isArray(relativePaths)) return [];
  return relativePaths.map(p => getFullUrl(p)).filter(Boolean);
};
