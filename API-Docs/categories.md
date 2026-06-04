# Categories API Documentation

Complete API reference for category management across panel, vendor, and public endpoints.

---

## Table of Contents

1. [Panel Category Endpoints](#panel-category-endpoints)
2. [Vendor Category Endpoints](#vendor-category-endpoints)
3. [Public Category Endpoints](#public-category-endpoints)
4. [Error Codes](#error-codes)

---

## Panel Category Endpoints

### 1. Get All Categories (Admin View)

**Endpoint:** `GET /api/panel/categories`

**Auth:** Required (admin/staff)

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 50)
- `isActive` (boolean, optional) - Filter by active status
- `groupSlug` (string, optional) - Filter by group slug

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Photography",
        "slug": "photography",
        "groupSlug": "visuals-and-beauty",
        "description": "Professional wedding photography services",
        "icon": "https://example.com/uploads/categories/photography-icon.png",
        "bannerImage": "https://example.com/uploads/categories/photography-banner.jpg",
        "colorCode": "#FF5733",
        "subtypes": ["Candid", "Traditional", "Pre-Wedding", "Drone"],
        "displayOrder": 1,
        "isFeatured": true,
        "isActive": true,
        "metaTitle": "Wedding Photography Services",
        "metaDescription": "Find the best wedding photographers",
        "metaKeywords": "wedding, photography, candid, traditional",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
}
```

---

### 2. Get Single Category

**Endpoint:** `GET /api/panel/categories/:categoryId`

**Auth:** Required (admin/staff)

**Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Photography",
      "slug": "photography",
      "groupSlug": "visuals-and-beauty",
      "description": "Professional wedding photography services",
      "icon": "https://example.com/uploads/categories/photography-icon.png",
      "bannerImage": "https://example.com/uploads/categories/photography-banner.jpg",
      "colorCode": "#FF5733",
      "subtypes": ["Candid", "Traditional", "Pre-Wedding", "Drone"],
      "displayOrder": 1,
      "isFeatured": true,
      "isActive": true,
      "metaTitle": "Wedding Photography Services",
      "metaDescription": "Find the best wedding photographers",
      "metaKeywords": "wedding, photography, candid, traditional"
    }
  }
}
```

---

### 3. Create Category

**Endpoint:** `POST /api/panel/categories`

**Auth:** Required (admin)

**Body:**
```json
{
  "name": "Photography",
  "slug": "photography",
  "groupSlug": "visuals-and-beauty",
  "description": "Professional wedding photography services",
  "colorCode": "#FF5733",
  "subtypes": ["Candid", "Traditional", "Pre-Wedding", "Drone"],
  "displayOrder": 1,
  "isFeatured": true,
  "isActive": true,
  "metaTitle": "Wedding Photography Services",
  "metaDescription": "Find the best wedding photographers",
  "metaKeywords": "wedding, photography, candid, traditional"
}
```

**Validation:**
- `name` (required) - String, min 2 characters, unique
- `slug` (optional) - Auto-generated if not provided, unique
- `groupSlug` (optional) - String for grouping categories
- `description` (optional) - Text
- `colorCode` (optional) - Hex color code (e.g., #FF5733)
- `subtypes` (optional) - Array of strings
- `displayOrder` (optional) - Integer (default: 0)
- `isFeatured` (optional) - Boolean (default: true)
- `isActive` (optional) - Boolean (default: true)
- `metaTitle` (optional) - String, max 150 characters
- `metaDescription` (optional) - String, max 300 characters
- `metaKeywords` (optional) - Text

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Photography",
      "slug": "photography",
      "displayOrder": 1,
      "isFeatured": true,
      "isActive": true
    }
  }
}
```

---

### 4. Update Category

**Endpoint:** `PUT /api/panel/categories/:categoryId`

**Auth:** Required (admin)

**Body:**
```json
{
  "name": "Wedding Photography",
  "groupSlug": "visuals-and-beauty",
  "description": "Updated description",
  "colorCode": "#FF6644",
  "subtypes": ["Candid", "Traditional", "Pre-Wedding", "Drone", "Cinematic"],
  "displayOrder": 2,
  "isFeatured": false,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": { /* updated category object */ }
  }
}
```

---

### 5. Delete Category

**Endpoint:** `DELETE /api/panel/categories/:categoryId`

**Auth:** Required (admin)

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

**Important Notes:**
- Soft delete (paranoid: true)
- Category can be restored if needed
- Associated portfolios remain intact

---

### 6. Toggle Active Status

**Endpoint:** `PATCH /api/panel/categories/status/:categoryId`

**Auth:** Required (admin)

**Body:**
```json
{
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category activated successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Photography",
      "isActive": true
    }
  }
}
```

---

### 7. Toggle Featured Status

**Endpoint:** `PATCH /api/panel/categories/featured/:categoryId`

**Auth:** Required (admin/marketing)

**Body:**
```json
{
  "isFeatured": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category marked as featured successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Photography",
      "isFeatured": true
    }
  }
}
```

---

### 8. Reorder Category

**Endpoint:** `PATCH /api/panel/categories/reorder/:categoryId`

**Auth:** Required (admin)

**Body:**
```json
{
  "displayOrder": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category reordered successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Photography",
      "displayOrder": 5
    }
  }
}
```

---

## Vendor Category Endpoints

### 1. Get Active Categories

**Endpoint:** `GET /api/vendor/categories`

**Auth:** Required (vendor)

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Photography",
        "slug": "photography",
        "groupSlug": "visuals-and-beauty",
        "description": "Professional wedding photography services",
        "icon": "https://example.com/uploads/categories/photography-icon.png",
        "bannerImage": "https://example.com/uploads/categories/photography-banner.jpg",
        "colorCode": "#FF5733",
        "subtypes": ["Candid", "Traditional", "Pre-Wedding", "Drone"],
        "displayOrder": 1,
        "isFeatured": true,
        "metaTitle": "Wedding Photography Services",
        "metaDescription": "Find the best wedding photographers"
      }
    ]
  }
}
```

**Important Notes:**
- Only active categories returned (`isActive: true`)
- Sorted by featured, display order, name
- Used for portfolio creation dropdown

---

## Public Category Endpoints

### 1. Get Active Categories

**Endpoint:** `GET /api/public/categories`

**Auth:** Not required (public)

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Photography",
        "slug": "photography",
        "groupSlug": "visuals-and-beauty",
        "description": "Professional wedding photography services",
        "icon": "https://example.com/uploads/categories/photography-icon.png",
        "bannerImage": "https://example.com/uploads/categories/photography-banner.jpg",
        "colorCode": "#FF5733",
        "subtypes": ["Candid", "Traditional", "Pre-Wedding", "Drone"],
        "displayOrder": 1,
        "isFeatured": true,
        "metaTitle": "Wedding Photography Services",
        "metaDescription": "Find the best wedding photographers"
      }
    ]
  }
}
```

**Important Notes:**
- Only active categories returned (`isActive: true`)
- Sorted by featured, display order, name
- Used for homepage category listing
- Used for category filter in search

---

## Error Codes

### Common Errors

**400 Bad Request**
```json
{
  "success": false,
  "message": "Category name is required"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Category not found"
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "Category name already exists"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to create category"
}
```

### Specific Error Messages

- `Category not found`
- `Category name is required`
- `Category name must be at least 2 characters`
- `Category name already exists`
- `Category slug already exists`
- `Category ID is required`
- `Active status is required`
- `Featured status is required`
- `Display order is required`

---

## Business Rules

### Category Creation
- Name must be unique
- Slug auto-generated if not provided
- Slug must be unique
- Group Slug optional for UI grouping
- Default values: `isFeatured: true`, `isActive: true`, `displayOrder: 0`

### Category Update
- Name uniqueness checked (excluding current category)
- Slug uniqueness checked (excluding current category)
- All fields optional

### Category Deletion
- Soft delete (can be restored)
- Associated portfolios remain intact
- Subscription plans remain intact

### Active Status
- Only active categories visible to vendors and public
- Inactive categories still visible in admin panel
- Can be toggled on/off

### Featured Status
- Featured categories appear first in listings
- Used for homepage highlighting
- Can be toggled on/off

### Display Order
- Controls sort order within featured/non-featured groups
- Lower numbers appear first
- Can be updated independently

---

## Sorting Logic

**All Endpoints:**
Categories are sorted by:
1. Featured categories first (`isFeatured: true`)
2. Then by display order (`displayOrder` ASC)
3. Finally by name (`name` ASC)

---

## Use Cases

### 1. Admin Category Management
```http
# List all categories
GET /api/panel/categories

# Create new category
POST /api/panel/categories
Body: { "name": "Makeup Artists", "groupSlug": "visuals-and-beauty", "colorCode": "#FF69B4" }

# Update category
PUT /api/panel/categories/5
Body: { "description": "Updated description" }

# Deactivate category
PATCH /api/panel/categories/status/5
Body: { "isActive": false }
```

### 2. Vendor Portfolio Creation
```http
# Get active categories for dropdown
GET /api/vendor/categories
```

### 3. Public Category Browsing
```http
# Get categories for homepage
GET /api/public/categories
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File URLs are full URLs (not relative paths)
- Subtypes are UI-only labels (no business logic)
- Color codes used for UI theming
- Meta fields used for SEO

---

## Summary

**Total Endpoints: 10**

- **Panel**: 8 (list, get, create, update, delete, toggle status, toggle featured, reorder)
- **Vendor**: 1 (list active)
- **Public**: 1 (list active)

All category endpoints are fully implemented and production-ready.
