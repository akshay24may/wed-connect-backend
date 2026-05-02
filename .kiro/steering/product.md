# WedConnect - Wedding Services Marketplace

A wedding services marketplace platform connecting consumers (couples/families) with wedding service vendors through location-based portfolios, subscription-driven vendor onboarding, and controlled content publishing.

## Core Features

- Category-based service organization (Photography, Venues, Catering, etc.)
- Vendor portfolio management with approval workflow
- City tier-based subscription system
- Real-time chat between consumers and vendors
- Reviews and ratings system
- Multi-storage image optimization (local/Cloudinary)
- Admin dashboard with analytics and content moderation
- Automated email/SMS/push notifications

## Target Audience

### Consumers
- Bride/Groom
- Couple/Family Member
- Wedding Planner (as consumer)

### Vendors (Service Providers)
- Venues
- Photographers/Videographers
- Makeup Artists
- Decorators
- Caterers
- Mehndi Artists
- DJ/Music
- Wedding Planners
- Wedding Cars/Transport
- Gift & Invite Services

## User Roles

- **consumer**: Couples/families looking for wedding services
- **vendor**: Service providers showcasing their work
- **super_admin**: Full system access, manage roles
- **admin**: Approve portfolios, manage users
- **accountant**: Financial management, billing, payments
- **marketing**: Feature portfolios, promotions
- **seo**: Content optimization, meta tags

## Key Concepts

### Categories & Subcategories
- **Categories**: Main service types (functional unit for all operations)
- **Subcategories**: UI-only labels (unclickable, informational)
- Subscription plans are at category level
- Vendor signup, plan purchase, and search all work at category level
- Subcategories have no business logic or data operations

### City Tier System
- Cities classified as Tier 1, Tier 2, or Tier 3
- Subscription limits vary by tier
- Admins can change city tier assignments dynamically

### Portfolios
- Vendors create portfolios showcasing their services
- Only published portfolios count toward quota
- Draft, pending, rejected, deleted don't count
- City selected at portfolio creation
- Portfolios shown based on user's city

### Subscription Plans
- Plans are category + city tier based
- Free plan by default with strict limits
- Paid plans with configurable quotas
- Lifetime validity (25 years for system)
- Each plan is unique per category + city tier combination
- Manual repurchase only (no auto-renewal)

### Portfolio Approval Workflow
- Draft → Pending → Approved/Rejected
- Admin approval required
- Approved portfolios cannot be edited directly
- Edits create a new approval cycle

### Featured Portfolios
- Subscription plans include max featured portfolio quota
- Vendors can mark N portfolios as featured (per plan limit)
- Featured portfolios displayed at top via scoring system
- Featured status only works for published portfolios

### Reviews & Ratings
- Consumers rate vendors (1-5 stars)
- Written reviews with vendor responses
- Users can report inappropriate reviews

### Communication
- In-app chat between consumers and vendors
- Chat-based inquiries (no formal booking system)
- Reporting only via chat context

## Terminology

**Use "portfolios" consistently throughout the codebase:**
- Database: `portfolios` table
- Code: `PortfolioController`, `portfolioService`, `portfolioRepository`
- API: `/api/portfolios`
- User-facing: "Browse Portfolios", "View Portfolio", "My Portfolios"

**NOT "listings", "ads", "profiles", or "showcases"**
