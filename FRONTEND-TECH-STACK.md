# Wedding Platform - Frontend Tech Stack (LOCKED)

## 🎯 Final Tech Stack

### **Core**
- **Next.js 14+** (App Router, JavaScript/ES6)
- **React 18+**
- **Tailwind CSS** ⭐

### **State Management**
- **Zustand**

### **Data Fetching**
- **TanStack Query (React Query)**

### **HTTP Client**
- **Axios**

### **Forms & Validation**
- **React Hook Form**
- **Yup**

### **Tables**
- **TanStack Table (React Table v8)**

### **Charts**
- **Recharts**

### **Date Handling**
- **date-fns**

### **Icons**
- **Lucide React** ⭐

### **File Upload**
- **react-dropzone**

### **Notifications**
- **react-hot-toast**

### **UI Components**
- **Custom components with Tailwind CSS** (No Shadcn)
- Build your own reusable components

---

## 📦 Installation Commands

```bash
# Create Next.js app (JavaScript, no TypeScript)
npx create-next-app@latest wedding-platform-frontend --js --tailwind --app --eslint

cd wedding-platform-frontend

# Install core dependencies
npm install zustand @tanstack/react-query axios

# Install forms & validation
npm install react-hook-form yup @hookform/resolvers

# Install table
npm install @tanstack/react-table

# Install charts
npm install recharts

# Install utilities
npm install date-fns clsx

# Install icons
npm install lucide-react

# Install file upload
npm install react-dropzone

# Install notifications
npm install react-hot-toast
```

---

## 📁 Project Structure (LOCKED)

```
wedding-platform-frontend/
├── app/
│   ├── (public)/                  # Public routes (consumers)
│   │   └── (pages will be added later)
│   │
│   ├── panel/                     # Admin panel routes
│   │   ├── layout.js              # Admin layout with sidebar
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── portfolios/
│   │   │   ├── page.js
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   ├── vendors/
│   │   │   ├── page.js
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   ├── users/
│   │   │   ├── page.js
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   ├── moderations/
│   │   │   └── page.js
│   │   ├── subscription-plans/
│   │   │   └── page.js
│   │   ├── transactions/
│   │   │   └── page.js
│   │   └── data-requests/
│   │       └── page.js
│   │
│   ├── vendor/                    # Vendor dashboard routes
│   │   └── (pages will be added later)
│   │
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
│
├── components/
│   ├── layout/
│   │   ├── panel/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── public/
│   │   │   └── (components will be added later)
│   │   └── vendor/
│   │       └── (components will be added later)
│   │
│   ├── ui/                        # Custom UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Tabs.jsx
│   │   ├── Dropdown.jsx
│   │   └── Spinner.jsx
│   │
│   ├── common/
│   │   ├── DataTable.jsx
│   │   ├── FilterBar.jsx
│   │   ├── StatsCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── ImageGallery.jsx
│   │   ├── Pagination.jsx
│   │   └── SearchInput.jsx
│   │
│   ├── charts/
│   │   ├── LineChart.jsx
│   │   ├── PieChart.jsx
│   │   └── BarChart.jsx
│   │
│   ├── forms/
│   │   ├── LoginForm.jsx
│   │   ├── PortfolioForm.jsx
│   │   ├── UserForm.jsx
│   │   └── SubscriptionPlanForm.jsx
│   │
│   └── portfolio/
│       └── (components will be added later)
│
├── lib/
│   ├── api.js                     # Axios instance & API calls
│   ├── utils.js                   # Utility functions
│   └── constants.js               # Constants
│
├── store/
│   ├── authStore.js               # Zustand auth store
│   ├── uiStore.js                 # Zustand UI store
│   └── portfolioStore.js          # Zustand portfolio store
│
├── hooks/
│   ├── useAuth.js
│   ├── usePortfolios.js
│   ├── useVendors.js
│   ├── useUsers.js
│   └── useDebounce.js
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local
├── .eslintrc.json
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

---

## 🎨 Tailwind Configuration

Configure `tailwind.config.js` with custom colors and theme extensions as needed.

---

## 🔧 Configuration Files

### jsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/store/*": ["./store/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  }
}
```

### .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000
```

---

## 📝 Code Style Rules

### ✅ DO:
- Use ES6 modules (import/export)
- Use arrow functions
- Use async/await
- Use template literals
- Use destructuring
- Use optional chaining (?.)
- Use nullish coalescing (??)
- Keep components small and focused
- Use meaningful variable names

### ❌ DON'T:
- No TypeScript
- No JSDoc comments
- No class components (use functional components)
- No inline styles (use Tailwind classes)
- No var (use const/let)
- No callbacks (use async/await)

---

## 🎯 Component Example (Standard Format)

```javascript
import { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

const UserCard = ({ user, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    setIsLoading(true);
    await onEdit(user.id);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {user.mobile}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleEdit}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-4 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
```

---

## 🚀 Getting Started

```bash
# 1. Create project
npx create-next-app@latest wedding-platform-frontend --js --tailwind --app --eslint

# 2. Install all dependencies
npm install zustand @tanstack/react-query axios react-hook-form yup @hookform/resolvers @tanstack/react-table recharts date-fns clsx lucide-react react-dropzone react-hot-toast

# 3. Setup jsconfig.json for path aliases

# 4. Create folder structure

# 5. Start development
npm run dev
```

---

## ✅ Tech Stack Summary

| Category | Library | Version |
|----------|---------|---------|
| Framework | Next.js | 14+ |
| Language | JavaScript | ES6+ |
| Styling | Tailwind CSS | 3+ |
| State | Zustand | Latest |
| Data Fetching | TanStack Query | Latest |
| HTTP | Axios | Latest |
| Forms | React Hook Form | Latest |
| Validation | Yup | Latest |
| Tables | TanStack Table | Latest |
| Charts | Recharts | Latest |
| Dates | date-fns | Latest |
| Icons | Lucide React | Latest |
| Upload | react-dropzone | Latest |
| Notifications | react-hot-toast | Latest |

---

**LOCKED AND FINALIZED** ✅
