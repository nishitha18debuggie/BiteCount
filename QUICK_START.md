# 🚀 BiteCount - Quick Start Guide

## Get Started in 5 Minutes!

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your MongoDB URI (or use default local)
# MONGODB_URI=mongodb://localhost:27017/bitecount
```

### Step 3: Seed the Database
```bash
node seed.js
```
This adds 26 sample food items to get you started!

### Step 4: Start the Server
```bash
npm start
```

### Step 5: Open Your Browser
Navigate to: **http://localhost:3000**

---

## 🎨 First Time Setup

### 1. **Try Dark Mode Immediately**
- Look for the **moon icon** 🌙 in the top navigation bar
- Click it to toggle between light and dark themes
- Your preference is saved automatically!

### 2. **Register an Account**
- Click **"Register"** in the navbar
- Fill in your details:
  - Full Name
  - Email
  - Password
  - Age, Gender, Height, Weight
  - Activity Level
- Click **"Register"** to create your account

### 3. **Explore Your Dashboard**
You'll see:
- **4 Stats Cards** showing calories, burned, net, and streak
- **Macronutrient Chart** (doughnut chart)
- **Calorie Balance Chart** (bar chart)
- **Activity Feed** (your logged meals and exercises)
- **Quick Actions** (shortcuts to log food/exercise)

### 4. **Log Your First Meal**
- Click **"Log Food"** in navbar or quick actions
- Select a food from the dropdown
- Choose meal type (breakfast, lunch, dinner, snack)
- Set portion size
- See **live nutrition preview**
- Click **"Log Food"**

### 5. **Log Your First Workout**
- Click **"Exercise"** in navbar
- Select exercise type from categorized dropdown
- Enter duration (minutes)
- Choose intensity (low, moderate, high)
- Add optional notes
- Click **"Log Exercise"**

### 6. **View Your Progress**
- Click **"Progress"** in navbar
- See beautiful charts:
  - 7-day calorie trend
  - Macronutrient distribution
  - Exercise activity
- Read AI-like weekly insights

### 7. **Update Your Profile**
- Click **"Profile"** in navbar
- View your health metrics (BMI, BMR, TDEE)
- Update personal information
- Change your password
- See account statistics

---

## 🎯 Admin Access

### Login as Admin
- **Email**: `admin@bitecount.com`
- **Password**: `admin123`

### Admin Features
- **Dashboard**: View system-wide statistics
- **Users**: Manage all registered users
- **Foods**: Add, edit, or delete food items
- **Reports**: View analytics with charts
- **Contacts**: Respond to user inquiries

⚠️ **Remember to change admin password in production!**

---

## 🌓 Dark Mode Features

### How to Toggle
1. Find the theme toggle button in any navbar
2. Click the moon 🌙 icon to switch to dark mode
3. Click the sun ☀️ icon to switch to light mode

### What Changes
- ✅ All backgrounds and text colors
- ✅ All cards and containers
- ✅ All charts and graphs
- ✅ All forms and inputs
- ✅ Footer and navbar
- ✅ Icons and badges

### Theme Persistence
Your theme choice is saved in browser localStorage and persists across:
- Page reloads
- Browser restarts
- Different sessions

---

## 📊 Understanding the Dashboard

### Stats Cards (Top Row)
1. **Calories Consumed**
   - Shows total calories eaten today
   - Progress bar vs. your goal
   - Trend indicator (On Track/Over/Under)

2. **Calories Burned**
   - Total from all exercises today
   - Number of workouts completed
   - Active status indicator

3. **Net Calories**
   - Consumed minus burned
   - Color-coded (green if good, red if high)
   - Status message

4. **Current Streak**
   - Days of consecutive logging
   - Motivational message
   - Best streak badge

### Charts
1. **Macronutrient Doughnut**
   - Visual breakdown of protein, carbs, fats
   - Today's totals
   - Percentage distribution

2. **Calorie Balance Bar**
   - Consumed, Burned, Net, Goal
   - Easy comparison
   - Color-coded bars

### Activity Feed
- Shows today's meals and exercises
- Sorted by time (most recent first)
- Grouped by meal type
- Delete option for each entry

---

## 🍽️ Food Logging Tips

### Using the Food Database
- 26 pre-loaded foods available
- Search by name in dropdown
- Shows calories per serving
- Nutrition info displayed

### Custom Foods
1. Click **"Custom Food"** button
2. Enter food name
3. Add nutrition values (calories, protein, carbs, fats)
4. Set serving size
5. Click **"Add Custom Food"**
6. It appears in your dropdown immediately!

### Meal Types
- 🌅 **Breakfast**: Morning meals
- ☀️ **Lunch**: Midday meals
- 🌙 **Dinner**: Evening meals
- 🍪 **Snack**: Anytime snacks

### Portion Sizes
- Default: 1.0 (one serving)
- Can use decimals: 0.5, 1.5, 2.0
- Nutrition preview updates live

---

## 🏋️ Exercise Logging Tips

### Exercise Categories
- **🏃 Cardio**: Running, cycling, swimming
- **💪 Strength**: Weight training, bodyweight
- **🧘 Flexibility**: Yoga, pilates, stretching
- **⚽ Sports**: Basketball, tennis, cricket
- **🎯 Other**: HIIT, aerobics, boxing

### Intensity Levels
- **😌 Low**: Light activity, easy pace
- **💪 Moderate**: Steady effort, can talk
- **🔥 High**: Hard effort, breathless

### Calorie Calculation
Calories burned are calculated based on:
- Your weight
- Exercise duration
- Intensity level
- Exercise type

---

## 📈 Progress Tracking

### Weekly Stats
- **Avg Daily Calories**: Your 7-day average
- **Avg Calories Burned**: Exercise average
- **Total Workouts**: Number of sessions
- **Active Days**: Days with any activity

### Charts
1. **7-Day Trend**: Line chart showing consumed, burned, and goal
2. **Macro Distribution**: Pie chart of protein, carbs, fats
3. **Exercise Activity**: Bar chart of workout duration

### Insights
AI-like recommendations based on your data:
- Calorie consistency feedback
- Activity level suggestions
- Macro balance tips

---

## 👤 Profile Management

### Health Metrics
- **BMI**: Body Mass Index with category
- **BMR**: Basal Metabolic Rate (calories at rest)
- **TDEE**: Total Daily Energy Expenditure

### Editable Fields
- Full Name
- Age
- Height (cm)
- Weight (kg)
- Activity Level
- Health Condition

### Locked Fields
- Email (cannot be changed)
- Gender (cannot be changed)

### Password Change
- Enter current password
- Enter new password (min 6 characters)
- Confirm new password
- Inline feedback on success/error

---

## 🎨 UI Features

### Animations
- ✨ Shimmer effect on progress bars
- 🎭 Smooth theme transitions
- 🚀 Hover effects on cards
- 📊 Chart animations

### Responsive Design
- **Desktop**: 4-column grid
- **Tablet**: 2-column grid
- **Mobile**: 1-column stack

### Color Coding
- 🟢 **Green**: Success, on track
- 🔵 **Blue**: Info, neutral
- 🟡 **Yellow**: Warning, moderate
- 🔴 **Red**: Danger, over limit

---

## 💡 Pro Tips

1. **Log Consistently**: Build a streak for motivation
2. **Use Custom Foods**: Add your favorite meals
3. **Check Progress Weekly**: Review insights every Sunday
4. **Adjust Goals**: Update profile as you progress
5. **Try Dark Mode**: Easier on eyes at night
6. **Explore Charts**: Hover for detailed tooltips
7. **Quick Actions**: Use dashboard shortcuts
8. **Set Reminders**: Log meals right after eating

---

## 🐛 Common Issues

### "Food not found"
- Make sure you ran `node seed.js`
- Check MongoDB connection

### "Charts not loading"
- Refresh the page
- Check browser console for errors
- Ensure Chart.js CDN is accessible

### "Theme not saving"
- Enable localStorage in browser
- Clear cache and try again

### "Can't login"
- Check email/password spelling
- Ensure account is registered
- Try admin credentials for testing

---

## 📞 Need Help?

1. Check the **[README.md](README.md)** for detailed info
2. Read **[DARK_MODE_GUIDE.md](DARK_MODE_GUIDE.md)** for theme help
3. See **[ENHANCED_UI_SUMMARY.md](ENHANCED_UI_SUMMARY.md)** for UI details
4. Use the **Contact Form** on the website
5. Check browser console for error messages

---

**Happy Tracking! 🎉**

Start your fitness journey with BiteCount today! 🥗💪📊
