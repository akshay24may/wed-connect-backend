# Portfolio Album API Documentation

Complete API reference for portfolio album management endpoints (vendor only).

---

## Base URL

All endpoints are prefixed with: `/api/vendor/portfolios`

---

## Authentication

All endpoints require authentication. Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

**Required Role:** `vendor`

---

## Endpoints

### 1. Get Albums for Portfolio

**GET** `/api/vendor/portfolios/:portfolioId/albums`

Get all albums for a specific portfolio (own portfolios only).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Response:**
```json
{
  "success": true,
  "message": "Albums retrieved successfully",
  "data": {
    "albums": [
      {
        "id": 1,
        "albumName": "Pre-Wedding Shoot",
        "albumDescription": "Beautiful pre-wedding moments at India Gate",
        "albumSlug": "pre-wedding-shoot-abc123",
        "locationName": "India Gate, New Delhi",
        "latitude": 28.6129,
        "longitude": 77.2295,
        "coverPhotoOne": "https://example.com/uploads/portfolio/123/album/1/cover1.jpg",
        "coverPhotoTwo": "https://example.com/uploads/portfolio/123/album/1/cover2.jpg",
        "coverPhotoThree": "https://example.com/uploads/portfolio/123/album/1/cover3.jpg",
        "mediaCount": 45,
        "displayOrder": 0,
        "isFeatured": true,
        "isPublic": true,
        "createdAt": "2024-01-10T08:00:00.000Z",
        "city": {
          "id": 10,
          "name": "Delhi",
          "slug": "delhi"
        }
      },
      {
        "id": 2,
        "albumName": "Wedding Day Coverage",
        "albumDescription": "Complete wedding day photography",
        "albumSlug": "wedding-day-coverage-xyz789",
        "locationName": "The Grand Palace, Gurgaon",
        "latitude": 28.4595,
        "longitude": 77.0266,
        "coverPhotoOne": "https://example.com/uploads/portfolio/123/album/2/cover1.jpg",
        "coverPhotoTwo": null,
        "coverPhotoThree": null,
        "mediaCount": 120,
        "displayOrder": 1,
        "isFeatured": false,
        "isPublic": true,
        "createdAt": "2024-01-12T10:00:00.000Z",
        "city": {
          "id": 15,
          "name": "Gurgaon",
          "slug": "gurgaon"
        }
      }
    ]
  }
}
```

**Example Request:**
```http
GET /api/vendor/portfolios/123/albums
Authorization: Bearer <token>
```

---

### 2. Get Single Album

**GET** `/api/vendor/portfolios/:portfolioId/albums/:albumId`

Get detailed information about a specific album.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `albumId` (number, required) - Album ID

**Response:**
```json
{
  "success": true,
  "message": "Album retrieved successfully",
  "data": {
    "album": {
      "id": 1,
      "portfolioId": 123,
      "userId": 456,
      "albumName": "Pre-Wedding Shoot",
      "albumDescription": "Beautiful pre-wedding moments at India Gate",
      "albumSlug": "pre-wedding-shoot-abc123",
      "cityId": 10,
      "citySlug": "delhi",
      "locationName": "India Gate, New Delhi",
      "latitude": 28.6129,
      "longitude": 77.2295,
      "coverPhotoOne": "https://example.com/uploads/portfolio/123/album/1/cover1.jpg",
      "coverPhotoTwo": "https://example.com/uploads/portfolio/123/album/1/cover2.jpg",
      "coverPhotoThree": "https://example.com/uploads/portfolio/123/album/1/cover3.jpg",
      "coverPhotosStorageType": "cloudinary",
      "mediaCount": 45,
      "displayOrder": 0,
      "isFeatured": true,
      "isPublic": true,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "portfolio": {
        "id": 123,
        "title": "Premium Wedding Photography Package",
        "slug": "premium-wedding-photography-package-abc123",
        "userId": 456
      },
      "city": {
        "id": 10,
        "name": "Delhi",
        "slug": "delhi"
      }
    }
  }
}
```

**Example Request:**
```http
GET /api/vendor/portfolios/123/albums/1
Authorization: Bearer <token>
```

---

### 3. Create Album

**POST** `/api/vendor/portfolios/:portfolioId/albums`

Create a new album for a portfolio.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:**
```json
{
  "albumName": "Pre-Wedding Shoot",
  "albumDescription": "Beautiful pre-wedding moments at India Gate",
  "cityId": 10,
  "citySlug": "delhi",
  "locationName": "India Gate, New Delhi",
  "latitude": 28.6129,
  "longitude": 77.2295,
  "displayOrder": 0,
  "isFeatured": false,
  "isPublic": true
}
```

**Required Fields:**
- `albumName` (string, min 3 characters) - Album name

**Optional Fields:**
- `albumDescription` (string) - Album description
- `cityId` (number) - City ID
- `citySlug` (string) - City slug
- `locationName` (string) - Location name
- `latitude` (decimal) - Latitude coordinate
- `longitude` (decimal) - Longitude coordinate
- `displayOrder` (number) - Display order (default: 0)
- `isFeatured` (boolean) - Featured album flag (default: false)
- `isPublic` (boolean) - Public visibility (default: true)

**Response:**
```json
{
  "success": true,
  "message": "Album created successfully",
  "data": {
    "album": {
      "id": 1,
      "portfolioId": 123,
      "userId": 456,
      "albumName": "Pre-Wedding Shoot",
      "albumDescription": "Beautiful pre-wedding moments at India Gate",
      "albumSlug": "pre-wedding-shoot-abc123",
      "cityId": 10,
      "citySlug": "delhi",
      "locationName": "India Gate, New Delhi",
      "latitude": 28.6129,
      "longitude": 77.2295,
      "displayOrder": 0,
      "isFeatured": false,
      "isPublic": true,
      "mediaCount": 0,
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  }
}
```

**Example Request:**
```http
POST /api/vendor/portfolios/123/albums
Authorization: Bearer <token>
Content-Type: application/json

{
  "albumName": "Pre-Wedding Shoot",
  "albumDescription": "Beautiful pre-wedding moments",
  "cityId": 10,
  "locationName": "India Gate, New Delhi",
  "latitude": 28.6129,
  "longitude": 77.2295
}
```

---

### 4. Update Album

**PUT** `/api/vendor/portfolios/:portfolioId/albums/:albumId`

Update album details.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `albumId` (number, required) - Album ID

**Request Body:** (all fields optional)
```json
{
  "albumName": "Updated Album Name",
  "albumDescription": "Updated description",
  "cityId": 15,
  "citySlug": "gurgaon",
  "locationName": "The Grand Palace, Gurgaon",
  "latitude": 28.4595,
  "longitude": 77.0266,
  "displayOrder": 2,
  "isFeatured": true,
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Album updated successfully",
  "data": {
    "album": {
      "id": 1,
      "albumName": "Updated Album Name",
      "albumDescription": "Updated description",
      "displayOrder": 2,
      "isFeatured": true,
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Example Request:**
```http
PUT /api/vendor/portfolios/123/albums/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "albumName": "Updated Album Name",
  "isFeatured": true
}
```

---

### 5. Delete Album

**DELETE** `/api/vendor/portfolios/:portfolioId/albums/:albumId`

Soft delete an album.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `albumId` (number, required) - Album ID

**Response:**
```json
{
  "success": true,
  "message": "Album deleted successfully"
}
```

**Example Request:**
```http
DELETE /api/vendor/portfolios/123/albums/1
Authorization: Bearer <token>
```

**Important Notes:**
- This is a soft delete (album can be restored)
- All media in the album remains but becomes orphaned
- Consider deleting or reassigning media before deleting album

---

### 6. Reorder Album

**PATCH** `/api/vendor/portfolios/:portfolioId/albums/:albumId/reorder`

Update album display order.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `albumId` (number, required) - Album ID

**Request Body:**
```json
{
  "displayOrder": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Album reordered successfully",
  "data": {
    "album": {
      "id": 1,
      "displayOrder": 2,
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Example Request:**
```http
PATCH /api/vendor/portfolios/123/albums/1/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayOrder": 2
}
```

**Display Order Logic:**
- Lower numbers appear first (0, 1, 2, ...)
- Albums with same order sorted by creation date
- Recommended: Use increments of 10 (0, 10, 20, ...) for easy reordering

---

### 7. Upload Album Media

**POST** `/api/vendor/albums/:albumId/media/upload`

Upload photos/videos to an album.

**URL Parameters:**
- `albumId` (number, required) - Album ID

**Request:** `multipart/form-data`
- `files` (array, required) - Multiple files (max 15)
- `mediaType` (string, required) - `image` or `video`

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media uploaded successfully",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "entityType": "portfolio",
        "entityId": 123,
        "subEntityType": "album",
        "subEntityId": 1,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/portfolio/123/album/1/photo.jpg",
        "thumbnailUrl": "https://example.com/uploads/portfolio/123/album/1/thumb_photo.jpg",
        "storageType": "cloudinary",
        "fileName": "photo_1234567890.jpg",
        "fileSizeBytes": 1536000,
        "width": 1920,
        "height": 1080,
        "displayOrder": 0,
        "isPrimary": false,
        "createdAt": "2024-01-15T10:00:00.000Z"
      },
      {
        "id": 2,
        "entityType": "portfolio",
        "entityId": 123,
        "subEntityType": "album",
        "subEntityId": 1,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/portfolio/123/album/1/photo2.jpg",
        "thumbnailUrl": "https://example.com/uploads/portfolio/123/album/1/thumb_photo2.jpg",
        "storageType": "cloudinary",
        "fileName": "photo2_1234567891.jpg",
        "fileSizeBytes": 1824000,
        "width": 1920,
        "height": 1080,
        "displayOrder": 1,
        "isPrimary": false,
        "createdAt": "2024-01-15T10:00:01.000Z"
      }
    ]
  }
}
```

**Example Request:**
```http
POST /api/vendor/albums/1/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [file1.jpg, file2.jpg, file3.jpg]
mediaType: image
```

**Upload Rules:**
- Max 15 files per upload
- Max file size: 10MB per file
- Supported image types: jpg, jpeg, png, webp
- Supported video types: mp4, mov
- Storage type determined by `STORAGE_TYPE` env variable
- Automatic thumbnail generation for images

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Album name is required"
}
```

```json
{
  "success": false,
  "message": "Album name must be at least 3 characters"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Portfolio not found"
}
```

```json
{
  "success": false,
  "message": "Album not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create album"
}
```

---

## Business Rules

### Ownership Validation
- Vendors can only manage albums for their own portfolios
- Album operations validate portfolio ownership
- Returns 404 if portfolio doesn't belong to user

### Album Slug Generation
- Automatically generated from album name
- Unique slug with random suffix
- Example: `pre-wedding-shoot-abc123`

### Display Order
- Albums sorted by `displayOrder` (ascending)
- Then by `createdAt` (descending)
- Recommended: Use increments of 10 (0, 10, 20, ...)

### Cover Photos
- Up to 3 cover photos per album
- Set via separate media upload endpoint
- Stored as `coverPhotoOne`, `coverPhotoTwo`, `coverPhotoThree`

### Media Count
- Automatically tracked in `mediaCount` field
- Updated when media is added/removed
- Used for display and analytics

### Featured Albums
- Vendors can mark albums as featured
- Featured albums displayed prominently
- No quota limit on featured albums

### Public/Private Visibility
- `isPublic: true` - Visible to public
- `isPublic: false` - Only visible to vendor
- Useful for work-in-progress albums

---

## Use Cases

### 1. Create Album for Portfolio
```http
POST /api/vendor/portfolios/123/albums
Content-Type: application/json

{
  "albumName": "Pre-Wedding Shoot",
  "albumDescription": "Beautiful moments",
  "locationName": "India Gate, Delhi"
}
```

### 2. Upload Photos to Album
```http
POST /api/vendor/albums/1/media/upload
Content-Type: multipart/form-data

files: [photo1.jpg, photo2.jpg, photo3.jpg]
mediaType: image
```

### 3. Reorder Albums
```http
# Set first album
PATCH /api/vendor/portfolios/123/albums/1/reorder
{ "displayOrder": 0 }

# Set second album
PATCH /api/vendor/portfolios/123/albums/2/reorder
{ "displayOrder": 10 }

# Set third album
PATCH /api/vendor/portfolios/123/albums/3/reorder
{ "displayOrder": 20 }
```

### 4. Feature an Album
```http
PUT /api/vendor/portfolios/123/albums/1
Content-Type: application/json

{
  "isFeatured": true
}
```

### 5. Make Album Private
```http
PUT /api/vendor/portfolios/123/albums/1
Content-Type: application/json

{
  "isPublic": false
}
```

---

## Album Structure

### Minimal Album
```json
{
  "albumName": "Wedding Day"
}
```

### Complete Album
```json
{
  "albumName": "Pre-Wedding Shoot",
  "albumDescription": "Beautiful pre-wedding moments at India Gate",
  "cityId": 10,
  "citySlug": "delhi",
  "locationName": "India Gate, New Delhi",
  "latitude": 28.6129,
  "longitude": 77.2295,
  "displayOrder": 0,
  "isFeatured": true,
  "isPublic": true
}
```

---

## Location Tracking

Albums support location tracking for:
- **City**: Link to city database
- **Location Name**: Free-text location description
- **Coordinates**: Latitude and longitude for map display

**Example:**
```json
{
  "cityId": 10,
  "citySlug": "delhi",
  "locationName": "India Gate, New Delhi",
  "latitude": 28.6129,
  "longitude": 77.2295
}
```

**Use Cases:**
- Display album location on map
- Filter albums by city
- Show nearby albums
- Location-based search

---

## Media Management

### Upload Media to Album
```http
POST /api/vendor/albums/:albumId/media/upload
```

### Get Album Media
```http
GET /api/vendor/portfolios/:portfolioId/media?subEntityType=album&subEntityId=:albumId
```

### Delete Album Media
```http
DELETE /api/vendor/portfolios/:portfolioId/media/:mediaId
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File URLs are full URLs (not relative paths)
- Soft delete used (albums can be restored)
- Audit fields (createdBy, updatedBy, deletedBy) automatically populated
- Album slug automatically generated from name
- Storage type determined by `STORAGE_TYPE` env variable

---

## Summary

**Total Endpoints: 7**

1. GET /api/vendor/portfolios/:portfolioId/albums - List albums
2. GET /api/vendor/portfolios/:portfolioId/albums/:albumId - Get single
3. POST /api/vendor/portfolios/:portfolioId/albums - Create album
4. PUT /api/vendor/portfolios/:portfolioId/albums/:albumId - Update album
5. DELETE /api/vendor/portfolios/:portfolioId/albums/:albumId - Delete album
6. PATCH /api/vendor/portfolios/:portfolioId/albums/:albumId/reorder - Reorder
7. POST /api/vendor/albums/:albumId/media/upload - Upload media

All endpoints require vendor authentication and validate portfolio ownership.
