# Portfolio Media Table - Analysis ✅

## Current Status: ALIGNED ✅

The `portfolio_media` table migration and model are **correctly aligned** with project standards.

---

## Schema Review

### Migration: `portfolio_media`

```sql
id BIGINT PRIMARY KEY AUTO_INCREMENT
portfolio_id BIGINT FK → portfolios (CASCADE/CASCADE)
album_id BIGINT FK → portfolio_albums (CASCADE/SET NULL)
media_type ENUM('image', 'video') DEFAULT 'image'
media_url VARCHAR(500)  -- Includes file extension (e.g., photo.jpg)
thumbnail_url VARCHAR(500)  -- Includes file extension
file_size_bytes BIGINT
width INTEGER
height INTEGER
duration_seconds INTEGER  -- For videos
display_order INTEGER DEFAULT 0
is_primary BOOLEAN DEFAULT false
storage_type ENUM(...) DEFAULT 'local'
deleted_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Model: `PortfolioMedia.js`

```javascript
// All fields properly mapped with field: 'snake_case'
mediaUrl: {
  field: 'media_url',
  get() {
    const rawValue = this.getDataValue('mediaUrl');
    const storageType = this.getDataValue('storageType');
    return getFullUrl(rawValue, storageType);  ✅ Correct signature
  }
}

thumbnailUrl: {
  field: 'thumbnail_url',
  get() {
    const rawValue = this.getDataValue('thumbnailUrl');
    const storageType = this.getDataValue('storageType');
    return getFullUrl(rawValue, storageType);  ✅ Correct signature
  }
}
```

---

## Project Standards Compliance ✅

### 1. File Storage Pattern ✅

**Standard**: File paths include extension, only `storage_type` column needed

```javascript
// ✅ Correct - Following project standard
media_url: "uploads/portfolios/user-123/photo.jpg"  // Extension included
storage_type: "local" or "cloudinary"

// ❌ Wrong - Old pattern (not used)
media_url: "uploads/portfolios/user-123/photo"
mime_type: "image/jpeg"
```

**Why this works:**
- Extension in path: `photo.jpg`, `video.mp4`
- `getFullUrl(path, storageType)` handles URL generation
- No need for separate `mime_type` column

### 2. URL Getters ✅

**Model getters correctly use `getFullUrl()`:**

```javascript
// ✅ Correct implementation
get() {
  const rawValue = this.getDataValue('mediaUrl');
  const storageType = this.getDataValue('storageType');
  return getFullUrl(rawValue, storageType);
}
```

**Returns:**
- Local: `http://localhost:5000/uploads/portfolios/user-123/photo.jpg`
- Cloudinary: `https://res.cloudinary.com/cloud-name/image/upload/wedconnect_app/uploads/portfolios/user-123/photo.jpg`

### 3. Field Mapping ✅

All fields properly mapped with `field: 'snake_case'`:

```javascript
portfolioId: { field: 'portfolio_id' }
albumId: { field: 'album_id' }
mediaType: { field: 'media_type' }
mediaUrl: { field: 'media_url' }
thumbnailUrl: { field: 'thumbnail_url' }
fileSizeBytes: { field: 'file_size_bytes' }
durationSeconds: { field: 'duration_seconds' }
displayOrder: { field: 'display_order' }
isPrimary: { field: 'is_primary' }
storageType: { field: 'storage_type' }
deletedAt: { field: 'deleted_at' }
```

### 4. Indexes ✅

Proper indexes for common queries:

```sql
idx_portfolio_media_portfolio_id  -- Get all media for portfolio
idx_portfolio_media_album_id      -- Get all media for album
idx_portfolio_media_media_type    -- Filter by image/video
idx_portfolio_media_is_primary    -- Find primary media
idx_portfolio_media_display_order -- Order media
idx_portfolio_media_deleted_at    -- Soft delete support
```

---

## Association Review

### Model Associations ✅

```javascript
static associate(models) {
  this.belongsTo(models.Portfolio, {
    foreignKey: 'portfolio_id',  ✅ Correct - uses snake_case
    as: 'portfolio'
  });

  this.belongsTo(models.PortfolioAlbum, {
    foreignKey: 'albumId',  ⚠️ Should be 'album_id' for consistency
    as: 'album'
  });
}
```

**Minor Issue**: Second association uses `albumId` instead of `album_id`

**Fix needed:**
```javascript
this.belongsTo(models.PortfolioAlbum, {
  foreignKey: 'album_id',  // ✅ Use snake_case
  as: 'album'
});
```

---

## Usage Examples

### Create Media

```javascript
const media = await PortfolioMedia.create({
  portfolioId: 123,
  albumId: 45,
  mediaType: 'image',
  mediaUrl: 'uploads/portfolios/user-123/photo.jpg',  // With extension
  thumbnailUrl: 'uploads/portfolios/user-123/thumb_photo.jpg',
  fileSizeBytes: 2048576,  // 2MB
  width: 1920,
  height: 1080,
  displayOrder: 1,
  isPrimary: true,
  storageType: 'local'
});

// Getter returns full URL
console.log(media.mediaUrl);
// → "http://localhost:5000/uploads/portfolios/user-123/photo.jpg"
```

### Query Media

```javascript
// Get all media for portfolio
const media = await PortfolioMedia.findAll({
  where: { portfolioId: 123 },
  order: [['display_order', 'ASC']]  // ✅ Use snake_case in ORDER BY
});

// Get primary image
const primary = await PortfolioMedia.findOne({
  where: { portfolioId: 123, isPrimary: true }
});

// Get images only
const images = await PortfolioMedia.findAll({
  where: { portfolioId: 123, mediaType: 'image' }
});

// Get videos only
const videos = await PortfolioMedia.findAll({
  where: { portfolioId: 123, mediaType: 'video' }
});
```

### Update Display Order

```javascript
// Reorder media
await PortfolioMedia.update(
  { displayOrder: 1 },
  { where: { id: 456 } }
);
```

### Set Primary Media

```javascript
// Unset all primary flags
await PortfolioMedia.update(
  { isPrimary: false },
  { where: { portfolioId: 123 } }
);

// Set new primary
await PortfolioMedia.update(
  { isPrimary: true },
  { where: { id: 456 } }
);
```

---

## Storage Quota Tracking

When media is uploaded/deleted, update subscription storage:

```javascript
async function updateStorageUsage(userId, categoryId) {
  const subscription = await UserSubscription.findOne({
    where: { userId, categoryId, status: 'active' }
  });
  
  if (!subscription) return;
  
  // Calculate total storage used
  const totalBytes = await PortfolioMedia.sum('file_size_bytes', {
    include: [{
      model: Portfolio,
      as: 'portfolio',
      where: { userId, categoryId },
      attributes: []
    }]
  });
  
  const totalMB = (totalBytes || 0) / (1024 * 1024);
  
  // Update subscription
  await subscription.update({ storageUsedMb: totalMB.toFixed(2) });
  
  // Check quota
  if (subscription.maxStorageMb && totalMB > subscription.maxStorageMb) {
    throw new Error(`Storage quota exceeded. Used: ${totalMB.toFixed(2)}MB, Limit: ${subscription.maxStorageMb}MB`);
  }
}
```

---

## Media Type Validation

### Image Validation

```javascript
async function validateImage(file, subscription) {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (subscription.maxStorageMb && fileSizeMB > subscription.maxStorageMb) {
    throw new Error(`File too large. Max: ${subscription.maxStorageMb}MB`);
  }
  
  // Check dimensions (if limits exist)
  const dimensions = await getImageDimensions(file);
  if (subscription.maxImageWidth && dimensions.width > subscription.maxImageWidth) {
    throw new Error(`Image width exceeds limit: ${subscription.maxImageWidth}px`);
  }
  if (subscription.maxImageHeight && dimensions.height > subscription.maxImageHeight) {
    throw new Error(`Image height exceeds limit: ${subscription.maxImageHeight}px`);
  }
  
  return dimensions;
}
```

### Video Validation

```javascript
async function validateVideo(file, subscription) {
  // Check if videos allowed
  if (!subscription.allowVideos) {
    throw new Error('Videos not allowed in your subscription plan');
  }
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (subscription.maxStorageMb && fileSizeMB > subscription.maxStorageMb) {
    throw new Error(`File too large. Max: ${subscription.maxStorageMb}MB`);
  }
  
  // Get video metadata
  const metadata = await getVideoMetadata(file);
  
  return {
    width: metadata.width,
    height: metadata.height,
    durationSeconds: Math.floor(metadata.duration)
  };
}
```

---

## Album Quota Checks

```javascript
async function checkAlbumQuotas(portfolioId, albumId, mediaType) {
  const portfolio = await Portfolio.findByPk(portfolioId, {
    include: [{ model: UserSubscription, as: 'userSubscription' }]
  });
  
  const subscription = portfolio.userSubscription;
  
  // Count current media in album
  const currentCount = await PortfolioMedia.count({
    where: { albumId, mediaType }
  });
  
  // Check quota
  if (mediaType === 'image') {
    if (currentCount >= subscription.maxPhotosPerAlbum) {
      throw new Error(`Photo quota exceeded. Max: ${subscription.maxPhotosPerAlbum} per album`);
    }
  } else if (mediaType === 'video') {
    if (currentCount >= subscription.maxVideosPerAlbum) {
      throw new Error(`Video quota exceeded. Max: ${subscription.maxVideosPerAlbum} per album`);
    }
  }
}
```

---

## Required Fix

### Association Foreign Key

**Current (inconsistent):**
```javascript
this.belongsTo(models.PortfolioAlbum, {
  foreignKey: 'albumId',  // ❌ camelCase
  as: 'album'
});
```

**Should be:**
```javascript
this.belongsTo(models.PortfolioAlbum, {
  foreignKey: 'album_id',  // ✅ snake_case
  as: 'album'
});
```

---

## Summary

### ✅ Correct
- Migration schema
- Field mapping (camelCase → snake_case)
- URL getters with `getFullUrl(path, storageType)`
- File paths include extensions
- Only `storage_type` column (no `mime_type`)
- Indexes
- Soft delete support

### ⚠️ Minor Fix Needed
- Association `foreignKey` should use `'album_id'` instead of `'albumId'`

### Status: MOSTLY ALIGNED ✅

Only one minor fix needed in the model association. Everything else is correctly aligned with project standards.
