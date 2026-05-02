# Wedding Services Marketplace & Planning Platform
## Final Requirements Document

---

## 1. Project Overview
A platform that enables users to discover, evaluate, and engage wedding service vendors through location-based portfolios, subscription-driven vendor onboarding, and controlled content publishing.

---

## 2. Target Audience / Industry

### 2.1 Consumers (Examples)
- Bride / Groom  
- Couple / Family Member  
- Wedding Planner (Consumer)

### 2.2 Service Providers / Industry Segments (Examples)
- Venues  
- Photographers / Videographers  
- Makeup Artists  
- Decorators  
- Caterers  
- Mehndi Artists  
- DJ / Music  
- Wedding Planners  
- Wedding Cars / Transport  
- Gift & Invite Services  

---

## 3. Authentication & Access Control
- Login via mobile number and/or email with password or OTP
- Only social login supported: Google
- Mobile number and email must be unique

---

## 4. Categories & Subcategories
- Categories are the main service types (e.g., Photography, Venues, Catering)
- Subcategories are UI-only labels for display purposes (unclickable, informational)
- Subcategories show what services are offered under a category but serve no functional purpose
- Subscription plans are defined at category level (not subcategory)
- Vendor signup, plan purchase, and service search all work at category level
- Subcategories do not affect any business logic or data operations

---

## 5. City Tier System
- Cities classified into Tier 1, Tier 2, Tier 3
- Subscription limits depend on city tier

---

## 6. Reviews & Ratings
- Users can rate vendors (1–5 stars)
- Written reviews supported
- Vendors can respond
- Users can report inappropriate reviews

---

## 7. Planning Tools

### Checklist
- Default wedding checklist templates
- Custom tasks
- Progress tracking

### Budget Planner
- Planned vs actual expenses
- Category-wise budgeting
- Over-budget alerts

---

## 8. Subscription Plan Architecture
- Plans are category + city tier based
- Free plan by default with strict limits
- Paid plans with configurable quotas
- Lifetime validity (25 years for system)
- Each plan is unique per category + city tier combination

---

## 9. Portfolio Rules
- Only published portfolios consume quota
- Draft, pending, rejected, deleted do not count
- City selected at portfolio creation

---

## 10. Portfolio Approval & Editing
- Admin approval required
- Approved portfolios cannot be edited directly
- Edits go through approval pipeline

---

## 11. Vendor Capabilities
- Vendors set their own prices
- Multiple category plans allowed (e.g., Photography + Videography)
- Same category plan can be repurchased only after quota exhaustion
- Vendors select category during signup and plan purchase

---

## 12. Discovery & Visibility
- Portfolios shown based on user’s city

---

## 13. Notifications
- Email, SMS, Push notifications
- Booking, message, reminder alerts

---

## 14. Communication & Reporting
- In-app chat
- Reporting only via chat context

---

## 15. Admin Panel

### Dashboard
- Total users
- Total bookings
- Revenue
- System metrics

### User Management
- Activate/deactivate users
- View activity

### Vendor Management
- Approve/decline vendors
- Feature portfolios
- Handle complaints

### Analytics & Reports
- Vendor performance
- User engagement
- Revenue trends

---

## 16. Non-Functional Requirements
- Scalable, secure, role-based access
- High availability and data integrity
