# WedConnect Backend - Complete Development Guide

This document consolidates all development guidelines, architecture patterns, and best practices for the WedConnect wedding services marketplace backend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Critical Rules](#critical-rules)
5. [Naming Conventions](#naming-conventions)
6. [Database Guidelines](#database-guidelines)
7. [Model Management](#model-management)
8. [API Design](#api-design)
9. [Authentication & Authorization](#authentication--authorization)
10. [File Storage & Media](#file-storage--media)
11. [Development Workflow](#development-workflow)

---

## Project Overview

**WedConnect** is a wedding services marketplace platform connecting consumers (couples/families) with wedding service vendors through location-based portfolios, subscription-driven vendor onboarding, and controlled content publishing.

### Core Features

- Category-based service organization (Photography, Venues, Catering, etc.)
- Vendor portfolio management with approval workflow
- City tier-based subscription system
- Reviews and ratings system
- Multi-storage image optimization (local/Cloudinary)
- Admin dashboard with analytics and content moderation

### User Roles

- **consumer**: Couples/families looking for wedding services
- **vendor**: Service providers showcasing their work
- **super_admin**: Full system access, manage roles
- **admin**: Approve portfolios, manage users
- **accountant**: Financial management, billing, payments
- **marketing**: Feature portfolios, promotions
- **seo**: Content optimization, meta tags

### Key Concepts

#### Categories & Subcategories
- **Categories**: Main service types (functional unit for all operations)
- **Subcategories**: UI-only labels (unclickable, informational)
- Subscription plans are at category level
- Vendor signup, plan purchase, and search all work at category level

#### City Tier System
- Cities classified as Tier 1, Tier 2, or Tier 3
- Subscription limits vary by tier
- Admins can change city tier assignments dynamically

#### Portfolios
- Vendors create portfolios showcasing their services
- Only published portfolios count toward quota
- Draft, pending, rejected, deleted don't count
- City selected at portfolio creation
- Portfolios shown based on user's city

#### Subscription Plans
- Plans are category + city tier based
- Free plan by default with strict limits
- Paid plans with configurable quotas
- Lifetime validity (25 years for system)
- Each plan is unique per category + city tier combination
- Manual repurchase only (no auto-renewal)

#### Portfolio Approval Workflow
- Draft → Pending → Approved/Rejected
- Admin approval required
- Approved portfolios cannot be edited directly
- Edits create a new approval cycle

---

## Technology Stack

### 🚨 CRITICAL: ES6 Modules Only

**This project uses ES6 modules exclusively (`"type": "module"` in package.json).**

- ALL files must use `import/export` syntax
- NO `require()` or `module.exports` allowed
- ALWAYS include `.js` extension in imports
- Migrations and seeders must also use ES6 syntax

### Backend Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v4.19+)
- **Database**: PostgreSQL with JSONB support
- **ORM**: Sequelize (v6.37+)
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Image Processing**: Sharp (compression, thumbnails)
- **File Upload**: Multer with configurable storage
- **Email**: Nodemailer
- **Logging**: Winston
- **Scheduling**: node-cron

### Storage Options

Two storage backends supported via `STORAGE_TYPE` environment variable:
- **local**: Development/testing (default)
- **cloudinary**: Production (recommended for deployment)

### Common Commands

```bash
# Install dependencies
npm install

# Database setup
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Development
npm run dev

# Production
npm start
```

### Environment Configuration

Key environment variables:
- `PORT`, `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`, `JWT_EXPIRY`
- `STORAGE_TYPE`, `UPLOAD_URL`
- `CLOUDINARY_*` (if using Cloudinary)
- `EMAIL_*` (for notifications)
- `CORS_ORIGIN`

---

## Project Structure

### Folder Organization

```
backend/
├── src/
│   ├── config/          # Database, passport, storage config
│   ├── controllers/     # Request handlers (classes with static methods)
│   │   ├── auth/        # Authentication controllers
│   │   ├── common/      # Shared resources (profile, locations)
│   │   ├── panel/       # Admin/staff panel controllers
│   │   ├── vendor/      # Vendor controllers
│   │   ├── consumer/    # Consumer controllers
│   │   └── public/      # Public API controllers
│   ├── services/        # Business logic - FLAT, NO SUBDIRECTORIES
│   ├── repositories/    # Database operations - FLAT, NO SUBDIRECTORIES
│   ├── models/          # Sequelize models
│   ├── middleware/      # Auth, validation, error handling - FLAT
│   ├── routes/          # API routes (organized like controllers)
│   ├── utils/           # Helpers, formatters, constants - FLAT
│   ├── uploads/         # Upload config and middleware
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── migrations/          # Database migrations
├── seeders/             # Database seeders
└── package.json
```

### 🚨 CRITICAL: Subdirectories ONLY for Controllers and Routes

**Subdirectories are used ONLY in:**
- `src/controllers/` - Organized by access level (auth, common, panel, vendor, consumer, public)
- `src/routes/` - Organized by access level (same structure as controllers)

**All other folders remain FLAT (no subdirectories):**
- `src/services/` - All service files in root
- `src/repositories/` - All repository files in root
- `src/middleware/` - All middleware files in root
- `src/utils/` - All utility files in root (except constants/ subfolder)

### Why Flat for Services & Repositories?

Even when breaking large services into multiple files, keep all files in the root directory:
- **One consistent rule** — no exceptions for multi-file modules
- **Simple imports** — `#services/portfolioApprovalService.js` vs nested paths
- **Self-organizing names** — filename prefixes group related services naturally
- **Zero decision fatigue** — no threshold questions about when to create folders

### Controller & Route Subdirectories

#### 1. `auth/` - Authentication
- **Purpose**: User authentication, token management, session handling
- **Access**: Public (no authentication required)
- **API Path**: `/api/auth/*`

#### 2. `common/` - Shared Resources
- **Purpose**: Resources accessible to multiple user types
- **Access**: Mixed (some public, some require authentication)
- **API Paths**: `/api/profile/*`, `/api/common/*`

#### 3. `panel/` - Admin/Staff Panels
- **Purpose**: All admin and staff operations
- **Access**: Requires authentication + specific role permissions
- **API Path**: `/api/panel/*`

#### 4. `vendor/` - Vendor Operations
- **Purpose**: Vendor's own resources and operations
- **Access**: Requires authentication (vendor role)
- **API Path**: `/api/vendor/*`

#### 5. `consumer/` - Consumer Operations
- **Purpose**: Consumer's own resources and operations
- **Access**: Requires authentication (consumer role)
- **API Path**: `/api/consumer/*`

#### 6. `public/` - Public APIs
- **Purpose**: Publicly accessible endpoints
- **Access**: Public (no authentication required)
- **API Path**: `/api/public/*`

### Service Breakdown Strategy

When a service grows beyond 800-1000 lines, split it by **responsibility domain**:

```
src/services/
├── portfolioService.js          # Core CRUD
├── portfolioApprovalService.js  # Approval workflow
├── portfolioMediaService.js     # Media upload, reorder, delete
├── portfolioSearchService.js    # Search, filter, sort, scoring
├── portfolioFeatureService.js   # Featured status, quota checks
```

**All files stay in `src/services/` root** — no subfolders.

### Architecture Layers

#### Controllers (Classes with static methods)
- Handle HTTP requests/responses
- Basic input validation
- Call service layer
- Use response formatters

#### Services (Singleton classes)
- Business logic
- Orchestrate repository calls
- Handle transactions
- Return: `{ success, message, data }`

#### Repositories (Singleton classes)
- Database operations only
- Pure CRUD
- No business logic

---

## Critical Rules

### 🚨 Code Comments Policy

**DO NOT write JSDoc comments or unnecessary lengthy comments. Keep code clean and self-explanatory.**

**Rules:**
- ❌ NO JSDoc comments (`/** */` style documentation)
- ❌ NO function/method documentation blocks
- ❌ NO parameter type annotations in comments
- ❌ NO return type documentation
- ❌ NO verbose explanatory comments for obvious code
- ✅ ONLY write comments for:
  - Important warnings or gotchas for future developers
  - Temporary workarounds or TODOs with context
  - Critical security or performance considerations

**Examples:**

```javascript
// ❌ WRONG - Unnecessary JSDoc
/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User object
 */
async getUserById(id) {
  return await User.findByPk(id);
}

// ✅ CORRECT - No comments needed (self-explanatory)
async getUserById(id) {
  return await User.findByPk(id);
}

// ✅ CORRECT - Important comment for complex logic
async calculateRelevanceScore(portfolio, userLocation) {
  // Price range scoring uses ±30% to balance precision with result count
  // Tested with 100K+ portfolios - narrower ranges return too few results
  const priceScore = this._calculatePriceScore(portfolio.price, userLocation.budget);
  return priceScore + locationScore + freshnessScore;
}
```

### 🚨 ES6 Modules Only

```javascript
// ✅ Correct - ES6 modules
import express from 'express';
import PortfolioService from '#services/portfolioService.js';
export default PortfolioController;
export { someFunction };

// ❌ WRONG - CommonJS (DO NOT USE)
const express = require('express');
module.exports = PortfolioController;
```

**Critical Requirements:**
- ALL files must use `import/export` syntax
- ALWAYS include `.js` extension in imports
- Use `import.meta.url` instead of `__dirname` when needed
- No `require()` or `module.exports` anywhere in the codebase

### ✅ ALWAYS Use Absolute Imports

```javascript
// ✅ Correct
import PortfolioService from '#services/portfolioService.js';
import { successResponse } from '#utils/responseFormatter.js';
import config from '#config/env.js';

// ❌ Wrong
import PortfolioService from '../../services/portfolioService.js';
```

**Configuration**: In `package.json`, use `"imports": { "#*": "./src/*" }` to enable absolute imports with the `#` prefix.

### ❌ NO Joi Validation

Use manual validation in service layer with simple checks for required fields, types, and formats. Throw descriptive errors.

```javascript
// ✅ Correct
if (!portfolioData.title || portfolioData.title.length < 10) {
  throw new Error('Title must be at least 10 characters');
}
```

### ✅ Use Constants for Response Messages

```javascript
// utils/constants/messages.js
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  PORTFOLIO_CREATED: 'Portfolio created successfully'
};

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  PORTFOLIO_NOT_FOUND: 'Portfolio not found'
};
```

Rules:
- Only success and error messages
- No nested structure
- Flat constants object
- Import and use directly

### ✅ Use Database Enums Constants

**CRITICAL: Always use database enum constants from `#utils/constants/databaseEnums.js` in service logic.**

Available enum constants:
- `MEDIA_ENTITY_TYPE` - Entity types for media table
- `MEDIA_SUB_ENTITY_TYPE` - Sub-entity types for media table

**Note**: Most ENUMs are defined in database migrations. Only use constants for STRING fields that need application-level validation.

### ✅ Use Custom Slugify Utility

**CRITICAL: Always use `generateUniqueSlug()` from `#utils/customSlugify.js` for generating slugs in model hooks.**

Available functions:
- `generateUniqueSlug(text, suffixLength)` - Generate slug with random suffix
- `customSlugify(text, options)` - Basic slugify with options
- `generateShareCode(limit)` - Generate uppercase alphanumeric code
- `generateFileName(originalFilename)` - Generate timestamped filename

### ✅ Modern JavaScript Standards

- Use `async/await` (no callbacks or `.then()`)
- Use arrow functions for consistency
- Use template literals for strings
- Use destructuring
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### ✅ Response Formatters

All responses use standardized formatters:
- `successResponse(res, data, message)`
- `errorResponse(res, message, statusCode)`
- `paginatedResponse(res, data, pagination, message)`
- `createResponse(res, data, message)`
- `notFoundResponse(res, message)`
- `unauthorizedResponse(res, message)`
- `forbiddenResponse(res, message)`
- `validationErrorResponse(res, errors)`

---

## Naming Conventions

### Files
- Controllers/Services/Repositories: `camelCase` (e.g., `authController.js`, `portfolioService.js`)
- Models: `PascalCase` (e.g., `User.js`, `Portfolio.js`)
- Routes: `camelCase` (e.g., `authRoutes.js`)
- Utilities: `camelCase` (e.g., `responseFormatter.js`)

### Classes
- All classes: `PascalCase` (e.g., `AuthController`, `PortfolioService`, `PortfolioRepository`)

### Variables & Functions
- Variables: `camelCase` (e.g., `userId`, `portfolioData`)
- Functions/Methods: `camelCase` (e.g., `getUserById`, `createPortfolio`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`, `MAX_FILE_SIZE`)
- Private methods: Prefix with `_` (e.g., `_validateInput`)

### Database
- Tables: `snake_case` plural (e.g., `users`, `portfolios`, `chat_rooms`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`)
- Booleans: Prefix with `is`, `has`, `can` (e.g., `is_featured`, `has_expired`)

### API Endpoints
- Format: `/api/resource` (e.g., `/api/portfolios`, `/api/users`)
- Naming: `kebab-case` lowercase (e.g., `/api/chat-rooms`)

### Route Design Best Practices

1. **Avoid Route Conflicts** - Place action/operation before ID parameter
   ```javascript
   // ✅ Correct - No conflicts
   PATCH /api/panel/subscription-plans/status/:id
   GET /api/panel/subscription-plans/:id
   
   // ❌ Wrong - Potential conflicts
   PATCH /api/panel/subscription-plans/:id/status
   ```

2. **Explicit State in Toggle Endpoints** - Always send new state explicitly in request payload
   ```javascript
   // ✅ Correct - Explicit state
   PATCH /api/panel/subscription-plans/status/:id
   Body: { isActive: true }
   
   // ❌ Wrong - Implicit toggle (race conditions)
   PATCH /api/panel/subscription-plans/status/:id
   // No body, just toggles current state
   ```

### Terminology

**Use "portfolios" consistently throughout the codebase:**
- Database: `portfolios` table
- Code: `PortfolioController`, `portfolioService`, `portfolioRepository`
- API: `/api/portfolios`
- User-facing: "Browse Portfolios", "View Portfolio", "My Portfolios"

**NOT "listings", "ads", "profiles", or "showcases"**

---

## Database Guidelines

### 🚨 CRITICAL: ID Conventions

**DO NOT use UUIDs for any table primary keys or foreign keys in this project.**

All IDs must be auto-incrementing integers (INT or BIGINT) based on expected table volume.

#### Use BIGINT for High-Volume Tables
- User-generated content tables
- Transaction/activity tables
- Communication tables
- Media/file tables

#### Use INT for Low-Volume Tables
- Configuration/lookup tables
- Admin-managed tables
- Reference data tables

**Examples:**
- **BIGINT**: Users, portfolios, messages, images, notifications, favorites, reviews, user_subscriptions
- **INT**: Categories, roles, subscription_plans, locations, settings

**Important**: Foreign keys must match the referenced primary key type.

### Audit Fields (Standard for Most Tables)

Include these audit fields in most tables:

```javascript
// In migrations
created_by: {
  type: Sequelize.BIGINT,
  allowNull: true,
  references: { model: 'users', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
},
updated_by: {
  type: Sequelize.JSON,  // or BIGINT - see guidelines below
  allowNull: true
},
deleted_by: {
  type: Sequelize.BIGINT,
  allowNull: true,
  references: { model: 'users', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
},
deleted_at: {
  type: Sequelize.DATE,
  allowNull: true
}
```

#### Audit Fields - updated_by Guidelines

1. **Low-volume tables** (< 10K rows, admin-managed):
   - Use `updated_by` as **JSON array** with full history
   - Structure: `[{userId, userName, timestamp}, ...]`
   - Examples: roles, permissions, categories, plans, settings

2. **High-volume tables** (100K+ rows, user-generated):
   - Use `updated_by` as **BIGINT** (last updater only)
   - References users(id) with FK constraint
   - Examples: users, portfolios, messages, images

3. **Junction/immutable tables**:
   - Omit `updated_by` entirely
   - Examples: role_permissions, favorites, logs

**Rules:**
- `created_by`, `deleted_by`, `deleted_at` should be **nullable** (allowNull: true)
- Use `paranoid: true` in Sequelize models for soft delete support
- Hooks work with nullable columns - they only populate when data is provided

### Sequelize with underscored: true

**When using `underscored: true` in Sequelize models, you must use snake_case column names in ORDER BY and raw attributes, NOT camelCase.**

```javascript
// ❌ Wrong - will cause "column does not exist" error
order: [['createdAt', 'DESC']]

// ✅ Correct - use snake_case database column names
order: [['created_at', 'DESC']]
```

**Attributes with timestamp columns:**
```javascript
// ❌ Wrong - Sequelize can't map createdAt to created_at in SELECT
attributes: ['id', 'name', 'createdAt']

// ✅ Correct - use array notation to alias snake_case to camelCase
attributes: ['id', 'name', ['created_at', 'createdAt']]
```

---

## Model Management

### Migration Pattern

```javascript
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    full_name: { type: Sequelize.STRING(150), allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });
  
  await queryInterface.addIndex('users', ['full_name'], { name: 'idx_users_full_name' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('users');
}
```

### Model Pattern (Class with Model.init)

```javascript
import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class User extends Model {
  static associate(models) {
    this.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
  }
}

User.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

export default User;
```

### File Storage Pattern

**File paths include extension, storage_type column tracks storage provider:**

```javascript
// Migration
cover_image: { type: Sequelize.STRING(500), allowNull: true },
cover_image_storage_type: { 
  type: Sequelize.ENUM('local', 'cloudinary', 'aws_s3', 'cloudflare_r2', 'gcs', 'azure_blob', 'digital_ocean', 'backblaze_b2', 'external', 'other'),
  allowNull: true 
}

// Model with getter
coverImage: {
  type: DataTypes.STRING(500),
  field: 'cover_image',
  get() {
    const rawValue = this.getDataValue('coverImage');
    const storageType = this.getDataValue('coverImageStorageType');
    return getFullUrl(rawValue, storageType);
  }
},
coverImageStorageType: {
  type: DataTypes.ENUM('local', 'cloudinary', 'aws_s3', 'cloudflare_r2', 'gcs', 'azure_blob', 'digital_ocean', 'backblaze_b2', 'external', 'other'),
  field: 'cover_image_storage_type'
}
```

### Model Registration

**🚨 CRITICAL: Register every model in `src/models/index.js` immediately after creation.**

```javascript
// 1. Import
import ModelName from './ModelName.js';

// 2. Add to models object
const models = { ModelName, /* ... */ };

// 3. Call associations
ModelName.associate(models);
```

**Always import from index:** `import models from '#models/index.js';`

### Seeders

**Never specify `id` in seeders - let database auto-increment:**

```javascript
// ✅ Correct
const roles = [
  { name: 'Admin', slug: 'admin' },
  { name: 'User', slug: 'user' }
];

// ❌ Wrong
const roles = [
  { id: 1, name: 'Admin', slug: 'admin' },
  { id: 2, name: 'User', slug: 'user' }
];
```

### Development Mode: Schema Changes

**During active development, DO NOT create new migrations for schema changes.**

Instead:
1. Update the original migration file
2. Update the model file
3. Provide raw SQL ALTER queries to run directly on the database

**Reason**: Prevents migration clutter during rapid development. Once in production, use proper migrations for all schema changes.

---

## API Design

### Response Format

All API responses follow this structure:
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ }
}
```

### Endpoint Organization

- `/api/auth/*` - Authentication (public)
- `/api/profile/*` - Profile operations (authenticated)
- `/api/common/*` - Public utilities (states, cities)
- `/api/panel/*` - Admin/staff operations (role-based)
- `/api/vendor/*` - Vendor operations (vendor role)
- `/api/consumer/*` - Consumer operations (consumer role)
- `/api/public/*` - Public browsing (no auth)

---

## Authentication & Authorization

### JWT Token Structure

**CRITICAL: Always cache role information in JWT tokens for performance.**

JWT payload must include:
```javascript
{
  userId: 123,           // BIGINT - user ID
  roleId: 3,             // INTEGER - role ID
  roleSlug: "vendor",    // VARCHAR - role slug for fast checks
  mobile: 9175113022,
  email: "user@example.com",
  iat: 1700000000,
  exp: 1700086400
}
```

**Why cache roleId and roleSlug?**
- ✅ Fast role checks without database query
- ✅ Middleware can check `roleSlug === 'super_admin'` instantly
- ✅ Can fetch permissions on-demand when needed
- ✅ Small token size (vs caching all permissions)

---

## File Storage & Media

### URL Transformation Standard

**Backend always saves relative paths in database. Use Sequelize model getters to serve full URLs to frontend.**

#### Database Storage
Always store relative paths:
```
uploads/portfolios/user-123/images/photo.jpg
```

#### Model Getters
Add getters to any model with file path columns:

```javascript
import { getFullUrl } from '#utils/storageHelper.js';

mediaUrl: {
  type: DataTypes.STRING(500),
  allowNull: false,
  field: 'media_url',
  get() {
    const rawValue = this.getDataValue('mediaUrl');
    const storageType = this.getDataValue('storageType');
    return getFullUrl(rawValue, storageType);
  }
}
```

#### Frontend Receives Full URLs
```json
{
  "mediaUrl": "http://localhost:5000/uploads/portfolios/user-123/images/photo.jpg"
}
```

### Models with File Paths
- `Media` - `mediaUrl`, `thumbnailUrl`
- `UserProfile` - `profilePhoto`
- `BusinessProfile` - `businessLogo`, `businessBanner`
- `Portfolio` - `coverImage`
- `PortfolioAlbum` - `coverPhotoOne`, `coverPhotoTwo`, `coverPhotoThree`
- `Category` - `icon`, `bannerImage`

**Important:** Always include storage_type column alongside file path columns for proper URL generation.

---

## Development Workflow

### Phase 1 Scope

Current implementation includes:
- ✅ Auth (login, signup, OTP, password reset)
- ✅ Profile (user profile management)
- ✅ Business Profile (vendor business details)
- ✅ Subscription (plans and user subscriptions)
- ✅ Portfolio (albums, media, reviews)

**NOT included in Phase 1:**
- ❌ Chat
- ❌ Enquiry
- ❌ Offers
- ❌ Notifications
- ❌ Favorites

### Model Checklist

When creating a new model:
- [ ] Migration: `export async function up/down`
- [ ] Model: Class with `Model.init()`
- [ ] Foreign keys: references, onUpdate, onDelete
- [ ] Indexes: Added separately, named `idx_table_column`
- [ ] Timestamps: created_at, updated_at, deleted_at
- [ ] Model fields: `field: 'snake_case'` mapping
- [ ] Associations: `static associate(models) {}`
- [ ] Registered in `src/models/index.js`
- [ ] File paths: WITH extension, storage_type column
- [ ] URL getters: Use `getFullUrl(path, storageType)`

### Documentation Guidelines

**🚨 CRITICAL: Minimize Documentation**

**DO NOT create unnecessary documents. Create ONLY what is essential.**

#### Required Documentation

1. **API Documentation** (`API-Docs/` folder)
   - **ONE document per feature/module**
   - Include: endpoints, parameters, request/response examples, error codes
   - **NO frontend integration code** (no React/Vue/JavaScript examples)

2. **Database Schema** (`DATABASE-SCHEMA.md`)
   - Update when creating/modifying tables
   - Keep concise: table name, columns, relationships, hooks only

3. **Implementation Notes** (ONLY if complex)
   - Create ONLY for complex features requiring special setup
   - Keep brief and actionable

#### DO NOT Create
- Summary documents
- Quick reference guides
- Checklists
- Testing guides (separate from API docs)
- Multiple documents for the same feature
- Redundant documentation

---

## Important Notes

### Sequelize Model Getters

**When using Sequelize model getters that depend on other columns, always include those columns in your `attributes` array.**

```javascript
// ❌ Wrong - getter won't work
attributes: ['id', 'mediaUrl', 'mediaType']

// ✅ Correct - includes columns needed by getter
attributes: ['id', 'mediaUrl', 'mediaType', 'storageType']
```

### Migration Best Practices

#### Handling Circular Dependencies

**Problem:** Some tables have circular foreign key dependencies (e.g., `roles` references `users` for audit fields, but `users` references `roles` for role assignment).

**Solution:**
1. Identify circular dependencies before creating migrations
2. Create tables in dependency order (parent tables first)
3. Omit problematic FK constraints in initial table creation
4. Document omitted constraints in migration comments
5. Create a follow-up migration to add constraints after all tables exist

---

## Summary

This guide consolidates all development guidelines for WedConnect backend. Follow these patterns consistently to maintain code quality, readability, and maintainability.

**Key Principles:**
- ES6 modules only, always include `.js` extensions
- Flat structure for services/repositories, subdirectories only for controllers/routes
- No JSDoc comments, keep code self-explanatory
- Use constants for messages, enums, and JSONB schemas
- Auto-incrementing integer IDs (BIGINT/INT), never UUIDs
- Relative paths in database, full URLs via model getters
- Manual validation in services, no Joi
- Standardized response formatters
- Minimal, essential documentation only
