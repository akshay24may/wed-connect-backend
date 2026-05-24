# WedConnect Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and set these required variables:
# - DATABASE_URL (your PostgreSQL connection string)
# - JWT_SECRET (any random string, e.g., "my-super-secret-key-123")
# - JWT_REFRESH_SECRET (different random string)
```

### Step 3: Setup Database
```bash
# Create database (if not exists)
createdb wedconnect_database

# Run migrations
npx sequelize-cli db:migrate

# (Optional) Run seeders
npx sequelize-cli db:seed:all
```

### Step 4: Start Server
```bash
npm run dev
```

You should see:
```
✅ WedConnect Server Started
🌐 HTTP Server: http://localhost:5000
🔌 Socket.IO: ws://localhost:5000
```

### Step 5: Test Authentication

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9175113022",
    "fullName": "John Doe",
    "password": "SecurePass123",
    "roleSlug": "vendor",
    "email": "john@example.com"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9175113022",
    "password": "SecurePass123"
  }'
```

---

## 📚 Documentation

- **API Documentation:** `API-Docs/authentication.md`
- **Testing Guide:** `AUTH-TESTING-CHECKLIST.md`
- **Module Details:** `AUTH-MODULE-README.md`
- **HTTP Tests:** `test-auth.http` (use with REST Client extension)

---

## 🔧 Troubleshooting

**Server won't start?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure JWT_SECRET is set

**Database errors?**
- Run migrations: `npx sequelize-cli db:migrate`
- Check database exists: `psql -l`

**Authentication not working?**
- Check console for OTP codes (development mode)
- Verify tokens in response
- Check user exists in database

---

## 📁 Project Structure

```
src/
├── config/          # Database, env, logger, passport
├── controllers/     # Request handlers
│   └── auth/        # Auth controllers
├── middleware/      # Auth, error handling
├── models/          # Sequelize models
├── repositories/    # Database operations
├── routes/          # API routes
│   └── auth/        # Auth routes
├── services/        # Business logic
├── utils/           # Helpers, formatters
├── app.js           # Express app
└── server.js        # Server entry point
```

---

## ✅ What's Implemented

### Authentication Module (Complete)
- ✅ User Registration (mobile + password)
- ✅ User Login (mobile + password)
- ✅ JWT Token Management (access + refresh)
- ✅ OTP System (request + verify)
- ✅ Password Reset (OTP-based)
- ✅ Session Management
- ✅ Role-based Authorization
- ✅ Middleware (authenticate, requireRole, etc.)

### Next Modules (Phase 1)
- ⏳ User Profile Management
- ⏳ Subscription Plans
- ⏳ Portfolios
- ⏳ Chat System
- ⏳ Common Routes (Locations, Categories)

---

## 🎯 Quick Commands

```bash
# Development
npm run dev              # Start with nodemon (auto-reload)

# Production
npm start                # Start server

# Database
npx sequelize-cli db:migrate              # Run migrations
npx sequelize-cli db:migrate:undo         # Undo last migration
npx sequelize-cli db:seed:all             # Run all seeders
npx sequelize-cli migration:generate --name migration-name  # Create migration

# Testing
# Use test-auth.http with REST Client extension
# Or use Postman/Insomnia with API-Docs/authentication.md
```

---

## 🔐 Default Roles

After running seeders, these roles are available:
- `super_admin` - Full system access
- `admin` - Admin panel access
- `marketing` - Marketing operations
- `seo` - SEO operations
- `accountant` - Financial operations
- `vendor` - Service providers
- `consumer` - End users

---

## 📞 Support

For issues or questions:
1. Check documentation in `API-Docs/`
2. Review `AUTH-TESTING-CHECKLIST.md`
3. Check console logs for errors
4. Verify environment variables

---

**Happy Coding! 🎉**
