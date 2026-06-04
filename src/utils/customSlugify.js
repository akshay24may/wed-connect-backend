import crypto from 'crypto';

export const customSlugify = (text, options = {}) => {
  const {
    lowercase = true,
    separator = '-',
    maxLength = 100
  } = options;

  if (!text) return '';

  let slug = text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, separator)
    .replace(new RegExp(`${separator}+`, 'g'), separator);

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    const lastSeparator = slug.lastIndexOf(separator);
    if (lastSeparator > 0) {
      slug = slug.substring(0, lastSeparator);
    }
  }

  return slug;
};

export const generateUniqueSlug = (text, suffixLength = 6) => {
  const baseSlug = customSlugify(text);
  const randomSuffix = crypto.randomBytes(suffixLength).toString('hex').substring(0, suffixLength);
  return `${baseSlug}-${randomSuffix}`;
};

export const generateShareCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  
  return code;
};

export const generateFileName = (originalFilename) => {
  const date = new Date();
  const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomChars = crypto.randomBytes(2).toString('hex'); // 4 hex characters
  
  const parts = originalFilename.split('.');
  const extension = parts.length > 1 ? parts.pop() : '';
  const baseName = parts.join('.') || 'file';
  
  const slugifiedName = customSlugify(baseName) || 'file';
  
  return `${yyyymmdd}-${slugifiedName}-${randomChars}${extension ? `.${extension}` : ''}`;
};
