# BiteCount 🥗

**Track. Eat. Transform.**

Your all-in-one calorie tracking and diet management app with **god-mode UI** and **full dark mode support**.

## ✨ Features

### 🎨 **Enhanced UI & Dark Mode**
- 🌓 **Full Dark/Light Mode** - Toggle between themes with smooth transitions
- 🎨 **God-Mode Design** - Beautiful, modern UI with advanced components
- 📊 **Theme-Aware Charts** - All graphs adapt to your selected theme
- 🎭 **Gradient Icons** - Stunning visual elements throughout
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile

### 📊 **Core Features**
- 🍽️ **Food Logging** - Track meals with detailed macro breakdown
- 🏋️ **Exercise Tracking** - Log workouts with intensity levels
- 📈 **Progress Visualization** - Beautiful charts showing your journey
- 🎯 **Personalized Goals** - BMR, TDEE, and calorie calculations
- 🏆 **Streak System** - Stay motivated with daily streaks
- 💪 **Health Metrics** - BMI, activity levels, and more

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Template Engine**: EJS
- **Authentication**: JWT + Sessions
- **Charts**: Chart.js
- **Email**: NodeMailer

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - MongoDB URI
   - JWT Secret
   - Email credentials (for contact form)

5. Seed the database with sample foods:
   ```bash
   node seed.js
   ```

6. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`

8. **Toggle Dark Mode**: Click the moon/sun icon in the navbar!

## Default Admin Credentials

- **Email**: admin@bitecount.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## Project Structure

```
BiteCount/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── config/
│   ├── db.js             # Database connection
│   └── auth.js           # Auth middleware
├── models/               # MongoDB schemas
│   ├── User.js
│   ├── Food.js
│   ├── FoodLog.js
│   ├── ExerciseLog.js
│   └── Contact.js
├── routes/               # Express routes
│   ├── publicRoutes.js
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── views/                # EJS templates
│   ├── partials/
│   ├── public/
│   ├── user/
│   └── admin/
└── public/               # Static assets
    ├── css/
    ├── js/
    └── images/
```

## 🚀 Usage

### For Users

1. **Visit the homepage** - Beautiful landing page with features
2. **Register a new account** - Quick and easy signup
3. **Log in to access your dashboard** - Enhanced UI with dark mode
4. **Toggle theme** - Click moon/sun icon for dark/light mode
5. **Track meals** - Log food with detailed nutrition info
6. **Log exercises** - Track workouts with intensity levels
7. **View progress** - Beautiful charts and weekly insights
8. **Update profile** - Manage your health metrics

### For Admins

1. **Log in with admin credentials** - Access admin dashboard
2. **Manage users** - View and manage all registered users
3. **Manage food database** - Add, edit, or remove food items
4. **View analytics** - Beautiful reports with Chart.js
5. **Respond to contacts** - Handle user inquiries

## 🎨 Enhanced Pages

All user pages have been redesigned with advanced UI:

### 📊 **Dashboard**
- 4 stats cards in single row (calories, burned, net, streak)
- Theme-aware charts (macros doughnut, calorie balance bar)
- Activity feed with meal grouping
- Quick action cards

### 🍽️ **Food Log**
- Summary cards for calories and macros
- Meals organized by type (breakfast, lunch, dinner, snack)
- Live nutrition preview
- Custom food creation

### 🏋️ **Exercise Log**
- Summary cards for workouts and intensity
- Categorized exercise dropdown
- Intensity indicators with emojis
- Quick start workout suggestions

### 📈 **Progress**
- 7-day calorie trend chart
- Macronutrient distribution
- Exercise activity visualization
- AI-like weekly insights

### 👤 **Profile**
- Health metrics (BMI, BMR, TDEE)
- Account statistics
- Enhanced form styling
- Inline password change

## Deployment

### MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env`

### Hosting (Render/Railway)

1. Push your code to GitHub
2. Connect your repository to Render/Railway
3. Add environment variables
4. Deploy!

## 📚 Documentation

- **[Dark Mode Guide](DARK_MODE_GUIDE.md)** - Complete guide to dark mode implementation
- **[Enhanced UI Summary](ENHANCED_UI_SUMMARY.md)** - Detailed overview of all UI improvements

## 🎯 Key Highlights

### **Dark Mode**
- ✅ Persistent theme preference (localStorage)
- ✅ Smooth transitions between themes
- ✅ Theme-aware charts and graphs
- ✅ All components support both modes
- ✅ Toggle button in all navbars

### **Footer Enhancements**
- ✅ Gradient background (different in light/dark)
- ✅ Colored top border for separation
- ✅ Gradient social media icons
- ✅ Hover animations with scale effects

### **Chart Improvements**
- ✅ Dark mode support with proper colors
- ✅ Theme-aware tooltips and grids
- ✅ Auto-reload on theme change
- ✅ Smooth animations

## 🐛 Troubleshooting

**Theme not persisting?**
- Check if localStorage is enabled in your browser
- Clear cache and reload

**Charts not visible in dark mode?**
- Ensure you're using the enhanced templates
- Charts will reload when theme changes

**IDE showing errors in .ejs files?**
- These are false positives from the linter
- The app runs perfectly despite these warnings
- Use the `workspace.code-workspace` file to suppress them

## License

Copyright © 2025 BiteCount | Designed by Mohan

---

**Need help?** Contact us through the contact form on the website.

**Enjoy your beautiful dark mode experience!** 🌙✨
