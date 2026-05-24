# Project Structure & Architecture

## Important Notes

**Ignore `old_project/` folder** - This is reference material only and should not be considered part of the active codebase.

## 🚨 CRITICAL: ID Conventions

**DO NOT use UUIDs for any table primary keys or foreign keys in this project.**

All IDs must be auto-incrementing integers (INT or BIGINT) based on expected table volume.

### Use BIGINT for High-Volume Tables
- User-generated content tables
- Transaction/activity tables
- Communication tables
- Media/file tables

### Use INT for Low-Volume Tables
- Configuration/lookup tables
- Admin-managed tables
- Reference data tables

## Folder Organization

```
backend/
├── src/
│   ├── config/          # Database, passport, storage config
│   ├── controllers/     # Request handlers (classes with static methods)
│   │   ├── auth/        # Authentication controllers (signup, login, logout)
│   │   ├── common/      # Shared resources (profile, locations)
│   │   ├── panel/       # Admin/staff panel controllers (all roles)
│   │   ├── vendor/      # Vendor controllers (portfolios, subscriptions)
│   │   ├── consumer/    # Consumer controllers (favorites, reviews)
│   │   └── public/      # Public API controllers (no auth required)
│   ├── services/        # Business logic (singleton classes) - FLAT, NO SUBDIRECTORIES
│   ├── repositories/    # Database operations (singleton classes) - FLAT, NO SUBDIRECTORIES
│   ├── models/          # Sequelize models
│   ├── middleware/      # Auth, validation, error handling - FLAT, NO SUBDIRECTORIES
│   ├── routes/          # API routes
│   │   ├── auth/        # Authentication routes
│   │   ├── common/      # Shared resource routes
│   │   ├── panel/       # Admin/staff panel routes
│   │   ├── vendor/      # Vendor routes
│   │   ├── consumer/    # Consumer routes
│   │   └── public/      # Public routes
│   ├── utils/           # Helpers, formatters, constants - FLAT, NO SUBDIRECTORIES
│   ├── uploads/         # Upload config and middleware
│   ├── socket/          # Socket.io handlers
│   ├── jobs/            # Cron jobs
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── migrations/          # Database migrations
├── seeders/             # Database seeders
└── package.json
```

## Subdirectory Organization Guidelines

### CRITICAL: Subdirectories ONLY for Controllers and Routes

**Subdirectories are used ONLY in:**
- `src/controllers/` - Organized by access level
- `src/routes/` - Organized by access level

**All other folders remain FLAT (no subdirectories):**
- `src/services/` - All service files in root (even if split across multiple files)
- `src/repositories/` - All repository files in root (even if split across multiple files)
- `src/middleware/` - All middleware files in root
- `src/utils/` - All utility files in root (except constants/ subfolder)

### Why Flat for Services & Repositories?

Even when breaking large services into multiple files (e.g., `portfolioService.js`, `portfolioApprovalService.js`, `portfolioMediaService.js`), keep all files in the root directory. This maintains:
- **One consistent rule** — no exceptions for multi-file modules
- **Simple imports** — `#services/portfolioApprovalService.js` vs nested paths
- **Self-organizing names** — filename prefixes group related services naturally
- **Zero decision fatigue** — no threshold questions about when to create folders

The filename prefix (`portfolio*`, `subscription*`) provides the same grouping benefit as folders, without the structural complexity.


### Controller & Route Subdirectories

#### 1. `auth/` - Authentication
**Purpose**: User authentication, token management, session handling

**Examples:**
- `controllers/auth/authController.js` - Signup, login, logout, refresh token
- `routes/auth/authRoutes.js` - Auth endpoints

**Access**: Public (no authentication required)
**API Path**: `/api/auth/*`

#### 2. `common/` - Shared Resources
**Purpose**: Resources accessible to multiple user types (vendors, consumers, admins)

**Examples:**
- `controllers/common/profileController.js` - Profile management for all users
- `controllers/common/locationController.js` - States/cities lookup
- `routes/common/profileRoutes.js` - Profile endpoints
- `routes/common/locationRoutes.js` - Location endpoints

**Access**: Mixed (some public, some require authentication, some admin-only)
**API Paths**: 
- `/api/profile/*` - Profile operations
- `/api/common/*` - Public utilities (states, cities)

#### 3. `panel/` - Admin/Staff Panels
**Purpose**: All admin and staff operations (super_admin, admin, marketing, seo, accountant)

**Examples:**
- `controllers/panel/categoryController.js` - Category management
- `controllers/panel/userManagementController.js` - User management
- `controllers/panel/dashboardController.js` - Statistics and analytics
- `controllers/panel/portfolioApprovalController.js` - Portfolio approval
- `routes/panel/categoryRoutes.js` - Category routes
- `routes/panel/dashboardRoutes.js` - Dashboard routes

**Access**: Requires authentication + specific role permissions
**API Path**: `/api/panel/*`

#### 4. `vendor/` - Vendor Operations
**Purpose**: Vendor's own resources and operations

**Examples:**
- `controllers/vendor/portfolioController.js` - Vendor's portfolios
- `controllers/vendor/subscriptionController.js` - Vendor's subscriptions
- `routes/vendor/portfolioRoutes.js` - Portfolio routes
- `routes/vendor/subscriptionRoutes.js` - Subscription routes

**Access**: Requires authentication (vendor role)
**API Path**: `/api/vendor/*`

#### 5. `consumer/` - Consumer Operations
**Purpose**: Consumer's own resources and operations

**Examples:**
- `controllers/consumer/favoriteController.js` - Consumer's favorites
- `controllers/consumer/reviewController.js` - Consumer's reviews
- `routes/consumer/favoriteRoutes.js` - Favorite routes
- `routes/consumer/reviewRoutes.js` - Review routes

**Access**: Requires authentication (consumer role)
**API Path**: `/api/consumer/*`

#### 6. `public/` - Public APIs
**Purpose**: Publicly accessible endpoints (no authentication required)

**Examples:**
- `controllers/public/portfolioController.js` - Browse all portfolios
- `controllers/public/categoryController.js` - Get categories
- `controllers/public/searchController.js` - Search functionality
- `routes/public/portfolioRoutes.js` - Public portfolio endpoints
- `routes/public/searchRoutes.js` - Search endpoints

**Access**: Public (no authentication required)
**API Path**: `/api/public/*`


### File Naming Examples

```
src/
├── controllers/
│   ├── auth/
│   │   └── authController.js          # Auth operations
│   ├── common/
│   │   ├── profileController.js       # Profile for all users
│   │   └── locationController.js      # States/cities lookup
│   ├── panel/
│   │   ├── categoryController.js      # Category management
│   │   ├── userManagementController.js # User management
│   │   ├── dashboardController.js     # Dashboard & analytics
│   │   └── portfolioApprovalController.js # Portfolio approval
│   ├── vendor/
│   │   ├── portfolioController.js     # Vendor's portfolios
│   │   └── subscriptionController.js  # Vendor's subscriptions
│   ├── consumer/
│   │   ├── favoriteController.js      # Consumer's favorites
│   │   └── reviewController.js        # Consumer's reviews
│   └── public/
│       ├── portfolioController.js     # Browse portfolios
│       ├── categoryController.js      # Get categories
│       └── searchController.js        # Search
├── services/                          # FLAT - NO SUBDIRECTORIES
│   ├── authService.js
│   ├── userProfileService.js
│   ├── portfolioService.js
│   ├── categoryService.js
│   ├── subscriptionService.js
│   ├── reviewService.js
│   └── imageService.js
├── repositories/                      # FLAT - NO SUBDIRECTORIES
│   ├── authRepository.js
│   ├── userProfileRepository.js
│   ├── portfolioRepository.js
│   ├── categoryRepository.js
│   ├── subscriptionRepository.js
│   └── reviewRepository.js
├── middleware/                        # FLAT - NO SUBDIRECTORIES
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorMiddleware.js
├── utils/                             # FLAT - NO SUBDIRECTORIES (except constants/)
│   ├── constants/
│   │   ├── messages.js
│   │   └── codes.js
│   ├── responseFormatter.js
│   ├── jwtHelper.js
│   ├── customSlugify.js
│   └── storageHelper.js
└── routes/
    ├── auth/
    │   └── authRoutes.js
    ├── common/
    │   ├── profileRoutes.js
    │   └── locationRoutes.js
    ├── panel/
    │   ├── categoryRoutes.js
    │   ├── dashboardRoutes.js
    │   └── userManagementRoutes.js
    ├── vendor/
    │   ├── portfolioRoutes.js
    │   └── subscriptionRoutes.js
    ├── consumer/
    │   ├── favoriteRoutes.js
    │   └── reviewRoutes.js
    └── public/
        ├── portfolioRoutes.js
        ├── categoryRoutes.js
        └── searchRoutes.js
```

### Import Path Examples

```javascript
// Controllers (with subdirectories)
import AuthController from '#controllers/auth/authController.js';
import ProfileController from '#controllers/common/profileController.js';
import LocationController from '#controllers/common/locationController.js';
import CategoryController from '#controllers/panel/categoryController.js';
import VendorPortfolioController from '#controllers/vendor/portfolioController.js';
import PublicPortfolioController from '#controllers/public/portfolioController.js';

// Services (flat - no subdirectories)
import authService from '#services/authService.js';
import userProfileService from '#services/userProfileService.js';
import portfolioService from '#services/portfolioService.js';
import categoryService from '#services/categoryService.js';

// Repositories (flat - no subdirectories)
import authRepository from '#repositories/authRepository.js';
import userProfileRepository from '#repositories/userProfileRepository.js';
import portfolioRepository from '#repositories/portfolioRepository.js';

// Middleware (flat - no subdirectories)
import authMiddleware from '#middleware/authMiddleware.js';
import uploadMiddleware from '#middleware/uploadMiddleware.js';

// Utils (flat - no subdirectories except constants/)
import { successResponse } from '#utils/responseFormatter.js';
import { SUCCESS_MESSAGES } from '#utils/constants/messages.js';
```


### Route Mounting Example

```javascript
// src/routes/index.js or src/app.js
import authRoutes from './routes/auth/authRoutes.js';
import commonProfileRoutes from './routes/common/profileRoutes.js';
import commonLocationRoutes from './routes/common/locationRoutes.js';
import panelCategoryRoutes from './routes/panel/categoryRoutes.js';
import panelDashboardRoutes from './routes/panel/dashboardRoutes.js';
import vendorPortfolioRoutes from './routes/vendor/portfolioRoutes.js';
import consumerFavoriteRoutes from './routes/consumer/favoriteRoutes.js';
import publicPortfolioRoutes from './routes/public/portfolioRoutes.js';
import publicSearchRoutes from './routes/public/searchRoutes.js';

// Mount routes
router.use('/auth', authRoutes);                           // /api/auth/*
router.use('/profile', commonProfileRoutes);               // /api/profile/*
router.use('/common', commonLocationRoutes);               // /api/common/*
router.use('/panel/categories', panelCategoryRoutes);      // /api/panel/categories/*
router.use('/panel/dashboard', panelDashboardRoutes);      // /api/panel/dashboard/*
router.use('/vendor/portfolios', vendorPortfolioRoutes);   // /api/vendor/portfolios/*
router.use('/consumer/favorites', consumerFavoriteRoutes); // /api/consumer/favorites/*
router.use('/public/portfolios', publicPortfolioRoutes);   // /api/public/portfolios/*
router.use('/public/search', publicSearchRoutes);          // /api/public/search/*
```

### Benefits

1. **Clear separation** of auth, panel, vendor, consumer, and public endpoints
2. **Easy to apply middleware** at route level (auth for vendor/consumer, role checks for panel)
3. **Better organization** as project grows
4. **Intuitive structure** for new developers
5. **Simplified access control** management
6. **Flat services/repositories** prevent deep nesting and import complexity

## Service Breakdown Strategy

When a service grows beyond 800-1000 lines, split it by **responsibility domain** rather than arbitrarily chunking:

```
src/services/
├── portfolioService.js          # Core CRUD - create, update, delete, get
├── portfolioApprovalService.js  # Approval workflow - submit, approve, reject
├── portfolioMediaService.js     # Media upload, reorder, delete
├── portfolioSearchService.js    # Search, filter, sort, scoring
├── portfolioFeatureService.js   # Featured status, quota checks
├── subscriptionService.js       # Core subscription operations
├── subscriptionQuotaService.js  # Quota management and checks
```

**All files stay in `src/services/` root** — no subfolders. Use filename prefixes for grouping.

### Splitting Guidelines

Split a service when:
- Multiple distinct workflows exist (approval, media, search)
- Mixed read/write complexity (separate read service vs write service)
- Admin vs user operations differ significantly
- File exceeds 800-1000 lines consistently

**Keep single-file services as-is** — don't create folders for 1-2 file modules.

### Controllers (Classes with static methods)
- Handle HTTP requests/responses
- Basic input validation
- Call service layer
- Use response formatters

### Services (Singleton classes)
- Business logic
- Orchestrate repository calls
- Handle transactions
- Return: `{ success, message, data }`

### Repositories (Singleton classes)
- Database operations only
- Pure CRUD
- No business logic

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


**Primary Key Guidelines:**

Use appropriate ID types based on expected table size:

```sql
-- For high-volume tables (users, portfolios, messages, images, etc.)
id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY

-- For small lookup/config tables (categories, roles, plans, etc.)
id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
```

In Sequelize migrations:
```javascript
// High-volume tables
id: {
  type: Sequelize.BIGINT,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
}

// Small tables
id: {
  type: Sequelize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
}
```

**When to use BIGINT vs INT:**
- **BIGINT** (8 bytes, ~9 quintillion max): Users, portfolios, messages, chat_rooms, images, notifications, favorites, reviews, reports, activity_logs, user_subscriptions
- **INT** (4 bytes, ~2.1 billion max): Categories, roles, subscription_plans, locations, settings, city_tiers

**Important**: Foreign keys must match the referenced primary key type (if parent uses BIGINT, child foreign key must also be BIGINT)

**Audit Fields (Standard for Most Tables):**

Include these audit fields in most tables for tracking and soft delete support:

```javascript
// In migrations
created_by: {
  type: Sequelize.BIGINT,
  allowNull: true,
  references: {
    model: 'users',
    key: 'id'
  },
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
  references: {
    model: 'users',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
},
deleted_at: {
  type: Sequelize.DATE,
  allowNull: true
}
```

**Audit Fields - updated_by Guidelines:**

1. **Low-volume tables** (< 10K rows, admin-managed):
   - Use `updated_by` as **JSON array** with full history
   - Structure: `[{userId, userName, timestamp}, ...]`
   - Examples: roles, permissions, categories, plans, settings
   - Add `beforeUpdate` hook to automatically append update records

2. **High-volume tables** (100K+ rows, user-generated):
   - Use `updated_by` as **BIGINT** (last updater only)
   - References users(id) with FK constraint
   - Examples: users, portfolios, messages, images
   - Add `beforeUpdate` hook to automatically set last updater

3. **Junction/immutable tables**:
   - Omit `updated_by` entirely
   - Examples: role_permissions, favorites, logs

**Rules:**
- `created_by`, `deleted_by`, `deleted_at` should be **nullable** (allowNull: true)
- `created_by` and `deleted_by` reference `users(id)` with FK constraints
- Use `paranoid: true` in Sequelize models for soft delete support
- Nullable FK constraints are valid - NULL when no user, FK enforced when NOT NULL
- **IMPORTANT**: Hooks work with nullable columns - they only populate when data is provided


**Example Hooks:**

```javascript
// Low-volume table (JSON array)
hooks: {
  beforeUpdate: async (instance, options) => {
    if (options.userId && options.userName) {
      const currentUpdates = instance.updatedBy || [];
      instance.updatedBy = [
        ...currentUpdates,
        {
          userId: options.userId,
          userName: options.userName,
          timestamp: new Date().toISOString()
        }
      ];
    }
  }
}

// High-volume table (BIGINT)
hooks: {
  beforeUpdate: async (instance, options) => {
    if (options.userId) {
      instance.updatedBy = options.userId;
    }
  }
}
```

### API Endpoints
- Format: `/api/resource` (e.g., `/api/portfolios`, `/api/users`)
- Naming: `kebab-case` lowercase (e.g., `/api/chat-rooms`)

**Route Design Best Practices:**

1. **Avoid Route Conflicts** - Place action/operation before ID parameter
   ```javascript
   // ✅ Correct - No conflicts
   PATCH /api/panel/subscription-plans/status/:id
   PATCH /api/panel/subscription-plans/visibility/:id
   GET /api/panel/subscription-plans/:id
   PUT /api/panel/subscription-plans/:id
   
   // ❌ Wrong - Potential conflicts
   PATCH /api/panel/subscription-plans/:id/status  // Conflicts with GET /:id
   PATCH /api/panel/subscription-plans/:id/visibility
   ```

2. **Explicit State in Toggle Endpoints** - Always send new state explicitly in request payload
   ```javascript
   // ✅ Correct - Explicit state
   PATCH /api/panel/subscription-plans/status/:id
   Body: { isActive: true }
   
   // ❌ Wrong - Implicit toggle (race conditions, unclear intent)
   PATCH /api/panel/subscription-plans/status/:id
   // No body, just toggles current state
   ```
   
   **Benefits:**
   - Frontend controls exact state
   - No race conditions
   - Clearer intent
   - Easier to test and debug
   - Idempotent operations

## Critical Rules

### 🚨 CRITICAL: Code Comments Policy

**DO NOT write JSDoc comments or unnecessary lengthy comments. Keep code clean and self-explanatory.**

**Rules:**
- ❌ NO JSDoc comments (`/** */` style documentation)
- ❌ NO function/method documentation blocks
- ❌ NO parameter type annotations in comments
- ❌ NO return type documentation
- ❌ NO verbose explanatory comments for obvious code
- ❌ NO business logic explanation
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

// ✅ CORRECT - Warning for future developers
async deleteUser(userId) {
  // IMPORTANT: Must delete user's portfolios first to avoid orphaned records
  // Cascade delete is disabled to prevent accidental data loss
  await this.deleteUserPortfolios(userId);
  return await User.destroy({ where: { id: userId } });
}
```

### 🚨 MANDATORY: ES6 Modules Only
**This project uses ES6 modules (`"type": "module"` in package.json). This is NON-NEGOTIABLE.**

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
- ALWAYS include `.js` extension in imports (e.g., `'#services/portfolioService.js'`)
- Use `import.meta.url` instead of `__dirname` when needed
- Sequelize migrations/seeders must also use ES6 syntax
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

### ✅ Use Custom Slugify Utility

**CRITICAL: Always use `generateUniqueSlug()` from `#utils/customSlugify.js` for generating slugs in model hooks.**

```javascript
// ✅ Correct - Use utility function
import { generateUniqueSlug } from '#utils/customSlugify.js';

hooks: {
  beforeCreate: async (instance, options) => {
    if (!instance.slug && instance.title) {
      instance.slug = generateUniqueSlug(instance.title);
    }
  }
}

// ❌ Wrong - Don't write slug generation inline
hooks: {
  beforeCreate: async (instance, options) => {
    const baseSlug = instance.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    instance.slug = `${baseSlug}-${randomSuffix}`;
  }
}
```

**Available functions:**
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

**Permission Check Flow:**
1. Decode JWT → get `roleId` and `roleSlug`
2. If `roleSlug === 'super_admin'` → allow all (bypass permission check)
3. Else → Query `role_permissions` table for specific permission
4. Optional: Cache user permissions in Redis with 5-10 minute TTL

**Example Middleware:**
```javascript
// Fast role check
if (req.user.roleSlug === 'super_admin') {
  return next();
}

// Permission check (query DB or Redis cache)
const hasPermission = await checkPermission(req.user.roleId, 'portfolios.approve');
if (!hasPermission) {
  return forbiddenResponse(res, 'Insufficient permissions');
}
```

## Response Format

All API responses follow this structure:
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ }
}
```

## Database Schema Documentation

**CRITICAL: Always update `DATABASE-SCHEMA.md` when:**
- Creating a new table
- Adding/modifying columns
- Creating relationships (associations)
- Adding model hooks

Keep it concise - table name, columns (with types), relationships, and hooks only.

## Documentation Guidelines

### 🚨 CRITICAL: Minimize Documentation

**DO NOT create unnecessary documents. Create ONLY what is essential.**

### Required Documentation

1. **API Documentation** (`API-Docs/` folder)
   - **ONE document per feature/module** (e.g., `API-Docs/portfolios.md`)
   - Include: endpoints, parameters, request/response examples, error codes
   - This is the ONLY document frontend developers need

2. **Database Schema** (`DATABASE-SCHEMA.md`)
   - Update when creating/modifying tables
   - Keep concise: table name, columns, relationships, hooks only

3. **Implementation Notes** (ONLY if complex)
   - Create ONLY for complex features requiring special setup
   - Examples: `MEDIA-UPLOAD-IMPLEMENTATION.md`, `FORM-DATA-SANITIZATION.md`
   - Keep brief and actionable

### ❌ DO NOT Create

- Summary documents
- Quick reference guides (info should be in main API doc)
- Checklists (use project management tools instead)
- Testing guides (separate from API docs)
- Multiple documents for the same feature
- Redundant documentation


### API Documentation Structure

**ONE comprehensive document per feature:**

```markdown
# Feature Name API Documentation

## Endpoints
- List all endpoints with methods

## Authentication
- Auth requirements

## Request/Response Examples
- Complete examples with all parameters

## Error Handling
- All error codes and messages

## Notes
- Important considerations
```

**🚨 CRITICAL: DO NOT include frontend integration code in API documentation.**
- **NO React/Vue/JavaScript examples**
- **NO sample frontend implementations**
- **NO client-side code snippets**
- **NO HTML/CSS examples**
- **NO frontend library usage examples**
- **Focus PURELY on API endpoints, parameters, and responses**

**This is a STRICT rule - API documentation must be backend-focused only.**

**Update API documentation whenever:**
- Service or repository code changes affect request/response
- New endpoints are added
- Endpoint behavior changes

## Migration Best Practices

### Handling Circular Dependencies

**Problem:** Some tables have circular foreign key dependencies (e.g., `roles` references `users` for audit fields, but `users` references `roles` for role assignment).

**Solution:**
1. **Identify circular dependencies** before creating migrations
2. **Create tables in dependency order** (parent tables first)
3. **Omit problematic FK constraints** in initial table creation
4. **Document omitted constraints** in migration comments
5. **Create a follow-up migration** to add constraints after all tables exist

**Example - Tables with Omitted Constraints:**
- `roles.created_by` → users (omitted initially)
- `roles.deleted_by` → users (omitted initially)
- `permissions.created_by` → users (omitted initially)
- `permissions.deleted_by` → users (omitted initially)
- `user_subscriptions.invoice_id` → invoices (omitted until invoices table exists)

**Follow-up Migration:**
A dedicated migration (`migrations/20251230000001-add-audit-foreign-keys.js`) adds these constraints back after all dependent tables exist.

```javascript
// Example: Adding constraint in follow-up migration
await queryInterface.addConstraint('roles', {
  fields: ['created_by'],
  type: 'foreign key',
  name: 'fk_roles_created_by',
  references: {
    table: 'users',
    field: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});
```

### Development Mode: Schema Changes

**During active development, DO NOT create new migrations for schema changes.**

Instead:
1. Update the original migration file
2. Update the model file
3. Provide raw SQL ALTER queries to run directly on the database

**Reason:** Prevents migration clutter during rapid development. Once in production, use proper migrations for all schema changes.

**Example workflow for adding a column:**
```javascript
// 1. Update migration file
phone: {
  type: Sequelize.STRING(20),
  allowNull: true
}

// 2. Update model file
phone: {
  type: DataTypes.STRING(20),
  allowNull: true,
  field: 'phone'
}

// 3. Provide SQL query
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```


## URL Transformation Standard

**Backend always saves relative paths in database. Use Sequelize model getters to serve full URLs to frontend.**

### Database Storage
Always store relative paths:
```
uploads/portfolios/user-123/images/photo.jpg
```

### Model Getters
Add getters to any model with file path columns:

```javascript
import { getFullUrl } from '#utils/storageHelper.js';

// Example: PortfolioMedia model
{
  mediaUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'media_url',
    get() {
      const rawValue = this.getDataValue('mediaUrl');
      const storageType = this.getDataValue('storageType');
      const mimeType = this.getDataValue('mimeType');
      return getFullUrl(rawValue, storageType, mimeType);
    }
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'thumbnail_url',
    get() {
      const rawValue = this.getDataValue('thumbnailUrl');
      const storageType = this.getDataValue('storageType');
      const mimeType = this.getDataValue('thumbnailMimeType');
      return getFullUrl(rawValue, storageType, mimeType);
    }
  }
}

// Example: UserProfile model
{
  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'profile_photo',
    get() {
      const rawValue = this.getDataValue('profilePhoto');
      const storageType = this.getDataValue('profilePhotoStorageType');
      const mimeType = this.getDataValue('profilePhotoMimeType');
      return getFullUrl(rawValue, storageType, mimeType);
    }
  }
}
```

### Frontend Receives Full URLs
```json
{
  "mediaUrl": "http://localhost:5000/uploads/portfolios/user-123/images/photo.jpg",
  "thumbnailUrl": "http://localhost:5000/uploads/portfolios/user-123/images/thumb_photo.jpg"
}
```

### Models with File Paths
- `PortfolioMedia` - `mediaUrl`, `thumbnailUrl` (requires `storageType`, `mimeType`, `thumbnailMimeType`)
- `ChatMessage` - `mediaUrl`, `thumbnailUrl` (requires `storageType`, `mimeType`, `thumbnailMimeType`)
- `UserProfile` - `profilePhoto` (requires `profilePhotoStorageType`, `profilePhotoMimeType`)
- `Category` - `iconUrl` (if implemented with storage)
- Any future models with file paths

**Important:** Always include storage_type and mime_type columns alongside file path columns for proper URL generation.

### Environment Variable
```env
UPLOAD_URL=http://localhost:5000
```


## Refactoring Tracking

**CRITICAL: Track all refactored files in the refactoring log.**

When migrating from EClassify to WedConnect, maintain a record of all modified files in `.kiro/steering/refactoring-log.md`.

**Rules:**
- Add entries ONLY after refactoring is complete
- Include file path, date, and brief description
- Mark status: ✅ Complete, 🚧 In Progress, or 🔍 Analyzing
- Group by category (Config, Models, Controllers, Services, etc.)

**Access the log:**
- Inclusion: `manual` (use `#refactoring-log` in chat to load it)
- Purpose: Avoid duplicate work, track migration progress

This ensures the team knows what has been updated and what still needs attention.
