# Subscription Refactoring - Quick Summary

## ✅ **YOUR CHANGES IMPLEMENTED**

### 1. **Boost Features** ✅
```sql
-- Added to both tables
max_boosted_portfolios INTEGER NOT NULL DEFAULT 0
boosted_days INTEGER NOT NULL DEFAULT 0
```
**Usage:** Vendors can boost portfolios for better visibility

### 2. **Platform Recommendation** ✅
```sql
-- Added to both tables
can_be_recommended BOOLEAN NOT NULL DEFAULT false
```
**Usage:** Only eligible subscriptions can have portfolios recommended by platform

### 3. **Unified Media File Size** ✅
```sql
-- Single column instead of separate photo/video sizes
max_media_file_size_mb INTEGER NULL
```
**Removed:**
- ❌ max_video_duration_seconds
- ❌ max_video_size_mb  
- ❌ max_photo_size_mb

**Now:** One limit for all media types (photos + videos)

### 4. **Republish Fields Kept** ✅
```sql
-- Kept in both tables
max_republish_count INTEGER NOT NULL DEFAULT 0
republish_cooldown_days INTEGER NOT NULL DEFAULT 7
```
**Logic:** Will use `portfolios.last_republished_at` column for tracking

### 5. **Upgrade Logic** ✅
- Free portfolio can upgrade to paid plan
- **MUST be same category** (Photography → Photography only)
- Validates existing portfolio count fits new plan
- Links subscriptions via `previous_subscription_id`

---

## 📊 **UPDATED QUOTA TABLE**

| Tier | Portfolios | Albums | Photos | Videos | File Size | Storage | Boost | Republish |
|------|-----------|--------|--------|--------|-----------|---------|-------|-----------|
| Free | 1 | 1 | 10 | 0 | 5 MB | 50 MB | 0 | 0 |
| Basic | 3 | 3 | 20 | 2 | 10 MB | 200 MB | 1 (3 days) | 3 (14 days) |
| Standard | 5 | 5 | 30 | 5 | 20 MB | 500 MB | 2 (7 days) | 10 (7 days) |
| Premium | 10 | 10 | 50 | 10 | 50 MB | 2 GB | 5 (15 days) | Unlimited (3 days) |

---

## 🔧 **WHAT TO REMOVE**

From `subscription_plans`:
- ❌ max_homepage_portfolios
- ❌ portfolios_quota_rolling_days

---

## ✅ **WHAT TO ADD**

### To `subscription_plans`:
1. category_slug
2. max_albums_per_portfolio
3. max_photos_per_album
4. max_videos_per_album
5. max_total_media_items
6. allow_videos
7. max_media_file_size_mb (unified)
8. max_image_width
9. max_image_height
10. max_boosted_portfolios
11. boosted_days
12. can_be_recommended

### To `user_subscriptions` (Complete Snapshot):
All above fields PLUS:
- category_id, category_name, category_slug
- city_tier
- priority_score, search_boost_multiplier
- national_visibility, featured_days
- max_republish_count, republish_cooldown_days
- is_auto_approve_enabled, support_level
- storage_used_mb (usage tracking)
- portfolios_published_count (usage tracking)
- portfolios_featured_count (usage tracking)
- portfolios_boosted_count (usage tracking)

---

## 🎯 **NEXT ACTIONS**

1. Create migration file for subscription_plans
2. Create migration file for user_subscriptions
3. Update SubscriptionPlan model
4. Update UserSubscription model
5. Create SubscriptionService with upgrade logic
6. Test migrations

**Seeders:** Will handle separately (not in this refactoring)

---

**Status:** Ready to implement ✅
