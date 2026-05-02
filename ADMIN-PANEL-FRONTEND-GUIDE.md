# Wedding Platform - Admin Panel Frontend Guide

## Overview

This guide outlines the admin panel structure, pages, components, and routing for the wedding platform. All admin routes start with `/panel/`.

---

## User Roles

- **super_admin**: Full system access
- **admin**: Portfolio approval, user management
- **marketing**: Feature portfolios, promotions
- **seo**: Content optimization
- **accountant**: Financial management

---

## Page Structure

### 1. Dashboard (`/panel/dashboard`)

**Purpose**: Overview of platform statistics and analytics

**Components:**
- **Stats Cards** (4 cards in a row)
  - Total Vendors
  - Total Revenue
  - Total Users (Consumers)
  - Active Subscriptions

- **Period Selector**
  - Buttons: Week, Month, Year
  - Default: Month

- **Revenue by Month Graph**
  - Type: Line chart or Bar chart
  - X-axis: Months
  - Y-axis: Revenue amount

- **Vendors by Category Graph**
  - Type: Pie chart or Donut chart
  - Shows distribution of vendors across categories (Photography, Venues, Catering, etc.)

- **Revenue by Category Graph**
  - Type: Bar chart
  - Shows revenue generated from each category

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Stats Cards (4 in a row)                       │
├─────────────────────────────────────────────────┤
│  Period Selector: [Week] [Month] [Year]        │
├─────────────────────────────────────────────────┤
│  Revenue by Month Graph                         │
├─────────────────────────────────────────────────┤
│  Vendors by Category | Revenue by Category      │
│  (Pie Chart)         | (Bar Chart)              │
└─────────────────────────────────────────────────┘
```

---

### 2. Portfolio Management (`/panel/portfolios`)

**Purpose**: View, filter, approve/reject vendor portfolios

**Components:**

- **Filter Bar**
  - Category dropdown (Photography, Venues, Catering, etc.)
  - Status dropdown (All, Draft, Pending, Published, Rejected)
  - Date range picker (From - To)
  - Search input (search by title)
  - Apply Filters button
  - Reset button

- **Portfolio Table**
  - Columns:
    - Thumbnail image
    - Title
    - Vendor Name
    - Category
    - City
    - Status badge
    - Created Date
    - Actions (View, Approve, Reject buttons)
  - Pagination at bottom

- **Portfolio Details Modal/Page** (`/panel/portfolios/:id`)
  - Full portfolio information
  - Image gallery (all uploaded images)
  - Vendor details
  - Service description
  - Price
  - Location
  - Action buttons: Approve, Reject (with reason input)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Portfolio Management                           │
├─────────────────────────────────────────────────┤
│  [Category ▼] [Status ▼] [Date Range] [Search] │
│  [Apply Filters] [Reset]                        │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | Img | Title | Vendor | Category | City |... │
│  |-----|-------|--------|----------|------|----|
│  | 📷  | ...   | ...    | ...      | ...  |... │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

### 3. Vendor Management (`/panel/vendors`)

**Purpose**: Manage vendor accounts

**Components:**

- **Filter Bar**
  - Search input (name, email, mobile)
  - Status dropdown (All, Active, Inactive, Blocked)
  - Date range picker (registration date)
  - Apply Filters button
  - Reset button

- **Vendor Table**
  - Columns:
    - Vendor Name
    - Email
    - Mobile
    - Status badge
    - KYC Status
    - Joined Date
    - Actions (View Details, View Subscriptions, Activate/Deactivate, Block)
  - Pagination at bottom

- **Vendor Details Page** (`/panel/vendors/:id`)
  - Personal Information section
  - Business Information section
  - Profile photo
  - Active subscription details
  - Action buttons: Activate/Deactivate, Block

- **Subscription History Tab**
  - Table showing all past and current subscriptions
  - Columns: Plan Name, Category, Status, Start Date, End Date, Quotas

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Vendor Management                              │
├─────────────────────────────────────────────────┤
│  [Search] [Status ▼] [Date Range]              │
│  [Apply Filters] [Reset]                        │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | Name | Email | Mobile | Status | KYC |...   │
│  |------|-------|--------|--------|-----|-------|
│  | ...  | ...   | ...    | ...    | ... |...   │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

### 4. User Management (`/panel/users`)

**Purpose**: Manage end users (consumers) and internal staff

**Two Tabs:**

#### Tab 1: End Users (Consumers)

**Components:**
- **Filter Bar**
  - Search input (name, email, mobile)
  - Status dropdown (All, Active, Inactive, Blocked)
  - Date range picker
  - Apply Filters button
  - Reset button

- **User Table**
  - Columns:
    - Name
    - Email
    - Mobile
    - Status badge
    - Joined Date
    - Actions (View Details, Activate/Deactivate, Block)
  - Pagination at bottom

#### Tab 2: Internal Users (Staff)

**Components:**
- **Create User Button** (top right)
- **Filter Bar** (same as End Users tab)
- **User Table**
  - Columns:
    - Name
    - Email
    - Mobile
    - Role (Admin, Marketing, SEO, Accountant)
    - Status badge
    - Joined Date
    - Actions (View Details, Activate/Deactivate)
  - Pagination at bottom

- **Create User Modal**
  - Form fields:
    - Full Name (required)
    - Mobile (required)
    - Email (optional)
    - Password (required)
    - Role dropdown (Admin, Marketing, SEO, Accountant)
    - Active checkbox
  - Submit button
  - Cancel button

- **User Details Page** (`/panel/users/:id`)
  - Personal information
  - Role information
  - Account status
  - Activity history
  - Action buttons: Activate/Deactivate, Block (no subscription history for consumers)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  User Management                                │
│  [End Users] [Internal Users]  [+ Create User]  │
├─────────────────────────────────────────────────┤
│  [Search] [Status ▼] [Date Range]              │
│  [Apply Filters] [Reset]                        │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | Name | Email | Mobile | Role | Status |...  │
│  |------|-------|--------|------|--------|------|
│  | ...  | ...   | ...    | ...  | ...    |...  │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

### 5. Moderations (`/panel/moderations`)

**Purpose**: Handle reported content

**Two Tabs:**

#### Tab 1: Reported Chats

**Components:**
- **Filter Bar**
  - Status dropdown (All, Pending, Reviewed, Resolved)
  - Apply Filters button

- **Reports Table**
  - Columns:
    - Reporter Name
    - Reported User
    - Reason
    - Date
    - Status badge
    - Actions (View Chat, Mark as Reviewed, Resolve)
  - Pagination at bottom

- **Chat Viewer Modal**
  - Full chat conversation between users
  - Participant names
  - Message timestamps
  - Action buttons: Mark as Reviewed, Resolve, Block User

#### Tab 2: Reported Portfolios

**Components:**
- **Filter Bar**
  - Status dropdown (All, Pending, Reviewed, Resolved)
  - Apply Filters button

- **Reports Table**
  - Columns:
    - Reporter Name
    - Portfolio Title
    - Vendor Name
    - Reason
    - Date
    - Status badge
    - Actions (View Portfolio, Mark as Reviewed, Resolve)
  - Pagination at bottom

- **Portfolio Viewer Modal**
  - Full portfolio details
  - All images
  - Vendor information
  - Action buttons: Mark as Reviewed, Resolve, Reject Portfolio, Block Vendor

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Moderations                                    │
│  [Reported Chats] [Reported Portfolios]         │
├─────────────────────────────────────────────────┤
│  [Status ▼] [Apply Filters]                    │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | Reporter | Target | Reason | Date | Status  │
│  |----------|--------|--------|------|---------|
│  | ...      | ...    | ...    | ...  | ...     │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

### 6. Subscription Plans (`/panel/subscription-plans`)

**Purpose**: Manage subscription plans for vendors

**Components:**

- **Create Plan Button** (top right)

- **Filter Bar**
  - Category dropdown (All, Photography, Venues, Catering, etc.)
  - Search input (search by plan title)
  - Date range picker (created date)
  - Active/Inactive toggle
  - Apply Filters button
  - Reset button

- **Plans Table**
  - Columns:
    - Plan Name
    - Category
    - Price
    - Max Portfolios
    - Featured Quota
    - Status badge (Active/Inactive)
    - Public badge (Published/Unpublished)
    - Actions (Edit, Publish/Unpublish, View Details)
  - Pagination at bottom

- **Create/Edit Plan Modal**
  - Form fields:
    - Plan Name (required)
    - Category dropdown (required)
    - Description
    - Base Price
    - Discount Amount
    - Final Price (calculated)
    - Duration (in days)
    - Max Total Portfolios
    - Max Featured Portfolios
    - Active checkbox
    - Public checkbox
  - Submit button
  - Cancel button

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Subscription Plans              [+ Create Plan]│
├─────────────────────────────────────────────────┤
│  [Category ▼] [Search] [Date Range] [Active ☑] │
│  [Apply Filters] [Reset]                        │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | Name | Category | Price | Quotas | Status   │
│  |------|----------|-------|--------|-----------|
│  | ...  | ...      | ...   | ...    | ...       │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

### 7. Transactions (`/panel/transactions`)

**Purpose**: View all payment transactions

**Components:**

- **Export Button** (top right)
  - Options: Export as CSV, Export as Excel

- **Filter Bar**
  - Status dropdown (All, Pending, Completed, Failed, Refunded)
  - Transaction Type dropdown (All, Payment, Refund)
  - Date range picker
  - Search input (user name, transaction ID)
  - Apply Filters button
  - Reset button

- **Transactions Table**
  - Columns:
    - Transaction ID
    - User Name
    - Amount
    - Plan Name
    - Status badge
    - Payment Method
    - Date
    - Actions (View Details)
  - Pagination at bottom

- **Transaction Details Modal**
  - Transaction ID
  - User information
  - Plan details
  - Amount breakdown
  - Payment gateway details
  - Status
  - Timestamps

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Transactions                      [📥 Export]  │
├─────────────────────────────────────────────────┤
│  [Status ▼] [Type ▼] [Date Range] [Search]    │
│  [Apply Filters] [Reset]                        │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | TXN ID | User | Amount | Plan | Status |... │
│  |--------|------|--------|------|--------|-----|
│  | ...    | ...  | ...    | ...  | ...    |... │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

### 8. Data Requests (`/panel/data-requests`)

**Purpose**: Handle city addition requests from users/vendors

**Components:**

- **Filter Bar**
  - Status dropdown (All, Pending, Approved, Rejected)
  - Apply Filters button

- **Requests Table**
  - Columns:
    - User Name
    - User Type (Vendor/Consumer)
    - Request Type (City)
    - City Name
    - State Name
    - Reason
    - Date
    - Status badge
    - Actions (Approve, Reject)
  - Pagination at bottom

- **Reject Modal**
  - Reason textarea
  - Submit button
  - Cancel button

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Data Requests                                  │
├─────────────────────────────────────────────────┤
│  [Status ▼] [Apply Filters]                    │
├─────────────────────────────────────────────────┤
│  Table:                                         │
│  | User | Type | City | State | Reason | Date  │
│  |------|------|------|-------|--------|--------|
│  | ...  | ...  | ...  | ...   | ...    | ...   │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 4 5 >                      │
└─────────────────────────────────────────────────┘
```

---

## Common Components

### 1. Sidebar Navigation
- Logo at top
- Navigation menu items:
  - Dashboard
  - Portfolio Management
  - Vendor Management
  - User Management
  - Moderations
  - Subscription Plans
  - Transactions
  - Data Requests
  - Categories (if needed)
  - Settings
- Logout button at bottom

### 2. Top Header Bar
- Page title
- User profile dropdown (top right)
  - User name
  - Role
  - Logout option

### 3. Stats Card
- Icon
- Title
- Value (large number)
- Optional trend indicator (↑ +12%)
- Color coding

### 4. Data Table
- Sortable columns
- Row actions
- Pagination controls
- Empty state message

### 5. Filter Bar
- Dropdowns for filters
- Date range picker
- Search input
- Apply/Reset buttons

### 6. Status Badge
- Color-coded badges:
  - Pending: Yellow
  - Published/Active/Completed: Green
  - Rejected/Inactive/Failed: Red
  - Draft: Gray

### 7. Confirmation Modal
- Title
- Message
- Confirm button
- Cancel button

### 8. Image Gallery
- Thumbnail grid
- Lightbox on click
- Primary image indicator

---

## Routing Structure

```
/panel/
├── login
├── dashboard
├── portfolios
│   └── :id (details)
├── vendors
│   └── :id (details)
├── users
│   └── :id (details)
├── moderations
├── subscription-plans
├── transactions
└── data-requests
```

---

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Sidebar    │  Top Header Bar                   │
│             ├───────────────────────────────────┤
│  - Dashboard│                                   │
│  - Portfolio│                                   │
│  - Vendors  │     Page Content Area             │
│  - Users    │                                   │
│  - Moderate │                                   │
│  - Plans    │                                   │
│  - Trans.   │                                   │
│  - Requests │                                   │
│             │                                   │
│  [Logout]   │                                   │
└─────────────┴───────────────────────────────────┘
```

---

## Responsive Design Notes

- **Desktop**: Full sidebar visible, multi-column layouts
- **Tablet**: Collapsible sidebar, 2-column layouts
- **Mobile**: Hamburger menu, single-column layouts, stacked filters

---

## Color Scheme Suggestions

- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Gray**: Neutral (#6b7280)

---

## Technology Recommendations

- **Framework**: React, Vue, or Next.js
- **UI Library**: Material-UI, Ant Design, or Tailwind CSS
- **Charts**: Recharts, Chart.js, or ApexCharts
- **Tables**: TanStack Table or AG Grid
- **Forms**: React Hook Form or Formik
- **Date Picker**: react-datepicker or date-fns

---

**End of Frontend Guide**
