# Database Schema

## Location Tables

### 1. countries

**Purpose**: Country master data

**Columns**:
- `id` - INTEGER, Primary Key, Auto Increment
- `name` - VARCHAR(100), NOT NULL, UNIQUE
- `slug` - VARCHAR(100), NOT NULL, UNIQUE
- `iso_code` - VARCHAR(2), NOT NULL, UNIQUE (ISO 3166-1 alpha-2)
- `iso_code_3` - VARCHAR(3), NOT NULL, UNIQUE (ISO 3166-1 alpha-3)
- `phone_code` - VARCHAR(10), NOT NULL
- `is_active` - BOOLEAN, NOT NULL, DEFAULT true
- `display_order` - INTEGER, NOT NULL, DEFAULT 0
- `created_by` - BIGINT, FK → users(id), ON DELETE SET NULL
- `updated_by` - JSON (update history array)
- `deleted_by` - BIGINT, FK → users(id), ON DELETE SET NULL
- `deleted_at` - TIMESTAMP, NULL (soft delete)
- `created_at` - TIMESTAMP, NOT NULL
- `updated_at` - TIMESTAMP, NOT NULL

**Relationships**:
- Has many `states`

**Indexes**:
- `idx_countries_slug` on (slug)
- `idx_countries_iso_code` on (iso_code)
- `idx_countries_is_active` on (is_active)

**Model Hooks**: None


### 2. states

**Purpose**: State/province master data

**Columns**:
- `id` - INTEGER, Primary Key, Auto Increment
- `country_id` - INTEGER, FK → countries(id), ON DELETE SET NULL
- `country_slug` - VARCHAR(100), NULL
- `slug` - VARCHAR(255), NOT NULL, UNIQUE
- `name` - VARCHAR(255), NOT NULL
- `state_code` - VARCHAR(10), NULL
- `region_slug` - VARCHAR(255), NOT NULL
- `region_name` - VARCHAR(255), NOT NULL
- `is_active` - BOOLEAN, NOT NULL, DEFAULT true
- `display_order` - INTEGER, NOT NULL, DEFAULT 0
- `is_popular` - BOOLEAN, NOT NULL, DEFAULT false
- `created_by` - BIGINT, FK → users(id), ON DELETE SET NULL
- `updated_by` - JSON (update history array)
- `deleted_by` - BIGINT, FK → users(id), ON DELETE SET NULL
- `deleted_at` - TIMESTAMP, NULL (soft delete)
- `created_at` - TIMESTAMP, NOT NULL
- `updated_at` - TIMESTAMP, NOT NULL

**Relationships**:
- Belongs to `countries`
- Has many `cities`

**Indexes**:
- `idx_states_slug` on (slug)
- `idx_states_country_id` on (country_id)
- `idx_states_popular_active` on (is_popular, is_active)

**Model Hooks**: None


### 3. cities

**Purpose**: City master data with tier classification for subscription plans

**Columns**:
- `id` - INTEGER, Primary Key, Auto Increment
- `state_id` - INTEGER, NOT NULL, FK → states(id), ON DELETE RESTRICT
- `name` - VARCHAR(255), NOT NULL
- `slug` - VARCHAR(255), NOT NULL, UNIQUE
- `state_slug` - VARCHAR(255), NOT NULL
- `state_code` - VARCHAR(10), NULL
- `district_code` - VARCHAR(10), NULL
- `headquarters` - VARCHAR(255), NULL
- `population` - INTEGER, NULL
- `area` - INTEGER, NULL
- `density` - INTEGER, NULL
- `latitude` - DECIMAL(10,8), NULL
- `longitude` - DECIMAL(11,8), NULL
- `city_tier` - VARCHAR(20), NOT NULL, DEFAULT 'tier_3'
- `is_active` - BOOLEAN, NOT NULL, DEFAULT true
- `display_order` - INTEGER, NOT NULL, DEFAULT 0
- `is_popular` - BOOLEAN, NOT NULL, DEFAULT false
- `created_by` - BIGINT, FK → users(id), ON DELETE SET NULL
- `updated_by` - JSON (update history array)
- `deleted_by` - BIGINT, FK → users(id), ON DELETE SET NULL
- `deleted_at` - TIMESTAMP, NULL (soft delete)
- `created_at` - TIMESTAMP, NOT NULL
- `updated_at` - TIMESTAMP, NOT NULL

**Relationships**:
- Belongs to `states`

**Indexes**:
- `idx_cities_slug` on (slug)
- `idx_cities_state_id` on (state_id)
- `idx_cities_state_active` on (state_id, is_active)
- `idx_cities_popular_active` on (is_popular, is_active)
- `idx_cities_state_popular_active` on (state_id, is_popular, is_active)
- `idx_cities_tier` on (city_tier)

**Model Hooks**: None

**Notes**:
- `city_tier` validation enforced via `src/utils/constants/cityTiers.js`
- Valid tiers: tier_1, tier_2, tier_3, tier_4, tier_5
