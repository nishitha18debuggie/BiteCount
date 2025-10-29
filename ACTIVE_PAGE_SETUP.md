# Active Page Highlighting & Nodemon Setup

## ✅ Changes Made:

### 1. **Nodemon Setup**
- Updated `package.json` so `npm start` now uses nodemon
- Server will auto-restart on file changes
- Use `npm run prod` for production (without nodemon)

### 2. **Active Page Highlighting**
- Updated `navbar-user.ejs` with active class logic
- Updated `navbar-admin.ejs` with active class logic
- Added CSS for `.nav-menu a.active` in `enhanced.css`
- Active page shows in **primary color** with **bold font** and **underline**

### 3. **Route Updates**
- All user routes now pass `currentPage` variable:
  - Dashboard: `currentPage: 'dashboard'`
  - Food Log: `currentPage: 'food-log'`
  - Exercise: `currentPage: 'exercise-log'`
  - Progress: `currentPage: 'progress'`
  - Profile: `currentPage: 'profile'`

- Admin routes pass `currentPage` variable:
  - Dashboard: `currentPage: 'dashboard'`
  - Users: `currentPage: 'users'`
  - Foods: `currentPage: 'foods'`
  - Reports: `currentPage: 'reports'`
  - Contacts: `currentPage: 'contacts'`

## ⚠️ Issue with adminRoutes.js

The admin routes file got corrupted during editing. Please restore it manually or I can recreate it.

## 🚀 To Test:

1. Stop the current server (Ctrl+C)
2. Run: `npm start`
3. Navigate to any page
4. The current page should be highlighted in the navbar

## 📝 What Active Page Looks Like:

- **Color**: Primary green color
- **Font**: Bold (700 weight)
- **Underline**: Full width underline
- **Hover**: Same styling

Example: If you're on the Dashboard page, the "Dashboard" link in the navbar will be green, bold, and underlined.
