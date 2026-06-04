import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { generateFileName } from '#utils/customSlugify.js';

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';

const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const createStorage = (entityType) => {
  if (STORAGE_TYPE === 'cloudinary') {
    return multer.memoryStorage();
  }

  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        let uploadPath;
        const userId = req.user?.userId;

        switch (entityType) {
          case 'user_profile':
            uploadPath = path.join(process.cwd(), 'uploads', 'users', `user-${userId}`);
            break;

          case 'business_profile':
            const businessId = req.params?.businessId;
            uploadPath = path.join(process.cwd(), 'uploads', 'business', `business-${businessId}`);
            break;

          case 'portfolio':
            const portfolioId = req.params?.portfolioId;
            uploadPath = path.join(process.cwd(), 'uploads', 'portfolios', `portfolio-${portfolioId}`);
            break;

          case 'album':
            const albumId = req.params?.albumId;
            const portfolioIdForAlbum = req.params?.portfolioId;
            uploadPath = path.join(
              process.cwd(),
              'uploads',
              'portfolios',
              `portfolio-${portfolioIdForAlbum}`,
              'albums',
              `album-${albumId}`
            );
            break;

          case 'review':
            const reviewId = req.params?.reviewId;
            uploadPath = path.join(process.cwd(), 'uploads', 'reviews', `review-${reviewId}`);
            break;

          default:
            throw new Error(`Unknown entity type: ${entityType}`);
        }

        await ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
      } catch (error) {
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      try {
        const uniqueName = generateFileName(file.originalname);
        cb(null, uniqueName);
      } catch (error) {
        cb(error, null);
      }
    }
  });
};

const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
    }
  };
};

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
const ALL_MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

export const uploadUserProfilePhoto = multer({
  storage: createStorage('user_profile'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: createFileFilter(IMAGE_TYPES)
}).single('photo');

export const uploadUserAvatar = multer({
  storage: createStorage('user_profile'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: createFileFilter(IMAGE_TYPES)
}).single('avatar');

export const uploadBusinessMedia = multer({
  storage: createStorage('business_profile'),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: createFileFilter(IMAGE_TYPES)
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);

export const uploadPortfolioMedia = multer({
  storage: createStorage('portfolio'),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 15
  },
  fileFilter: createFileFilter(ALL_MEDIA_TYPES)
}).array('files', 15);

export const uploadAlbumMedia = multer({
  storage: createStorage('album'),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 15
  },
  fileFilter: createFileFilter(ALL_MEDIA_TYPES)
}).array('files', 15);

export const uploadReviewMedia = multer({
  storage: createStorage('review'),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  },
  fileFilter: createFileFilter(ALL_MEDIA_TYPES)
}).array('files', 5);

export default {
  userProfilePhoto: uploadUserProfilePhoto,
  userAvatar: uploadUserAvatar,
  businessMedia: uploadBusinessMedia,
  portfolioMedia: uploadPortfolioMedia,
  albumMedia: uploadAlbumMedia,
  reviewMedia: uploadReviewMedia
};
