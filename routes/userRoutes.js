const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../config/auth');
const User = require('../models/User');
const Food = require('../models/Food');
const FoodLog = require('../models/FoodLog');
const ExerciseLog = require('../models/ExerciseLog');
const Achievement = require('../models/Achievement');
const WaterIntake = require('../models/WaterIntake');
const GamificationService = require('../services/gamificationService');
const { body, validationResult } = require('express-validator');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// User Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Initialize achievements for new users
    await GamificationService.initializeAchievements(req.user.userId);
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's food logs
    const foodLogs = await FoodLog.find({
      userId: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    // Get today's exercise logs
    const exerciseLogs = await ExerciseLog.find({
      userId: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    // Calculate totals
    const caloriesConsumed = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const caloriesBurned = exerciseLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFats = foodLogs.reduce((sum, log) => sum + log.fats, 0);

    const netCalories = caloriesConsumed - caloriesBurned;
    const calorieGoal = user.calorieGoal;

    // Update streak
    await updateUserStreak(user);
    
    // Get water intake for today
    let waterLog = await WaterIntake.findOne({
      userId: req.user.userId,
      date: today
    });
    
    const waterProgress = waterLog ? Math.round((waterLog.glasses / waterLog.target) * 100) : 0;
    const caloriesBurnProgress = user.dailyTargets.caloriesBurn > 0 ? Math.round((caloriesBurned / user.dailyTargets.caloriesBurn) * 100) : 0;

    res.render('user/dashboard-enhanced', {
      title: 'Dashboard - BiteCount',
      currentPage: 'dashboard',
      user,
      caloriesConsumed,
      caloriesBurned,
      netCalories,
      calorieGoal,
      totalProtein,
      totalCarbs,
      totalFats,
      foodLogs,
      exerciseLogs,
      waterProgress,
      caloriesBurnProgress
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server error');
  }
});

// Food Log Page
router.get('/food-log', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const foods = await Food.find({ $or: [{ isCustom: false }, { createdBy: req.user.userId }] }).sort({ name: 1 });

    // Get today's food logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const foodLogs = await FoodLog.find({
      userId: req.user.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFats = foodLogs.reduce((sum, log) => sum + log.fats, 0);

    res.render('user/food-log-enhanced', {
      title: 'Food Log - BiteCount',
      currentPage: 'food-log',
      user,
      foods,
      foodLogs,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      success: req.query.success || null,
      errors: null
    });

  } catch (error) {
    console.error('Food log page error:', error);
    res.status(500).send('Server error');
  }
});

// Add Food Log
router.post('/food-log', [
  body('foodId').notEmpty().withMessage('Food selection is required'),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Valid meal type is required'),
  body('portion').isFloat({ min: 0.1 }).withMessage('Portion must be greater than 0')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const user = await User.findById(req.user.userId);
    const foods = await Food.find({ $or: [{ isCustom: false }, { createdBy: req.user.userId }] }).sort({ name: 1 });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const foodLogs = await FoodLog.find({
      userId: req.user.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFats = foodLogs.reduce((sum, log) => sum + log.fats, 0);
    
    return res.render('user/food-log-enhanced', {
      title: 'Food Log - BiteCount',
      user,
      foods,
      foodLogs,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      success: null,
      errors: errors.array()
    });
  }

  try {
    const { foodId, mealType, portion } = req.body;
    const food = await Food.findById(foodId);

    if (!food) {
      throw new Error('Food not found');
    }

    const portionMultiplier = parseFloat(portion);

    const foodLog = new FoodLog({
      userId: req.user.userId,
      foodId: food._id,
      foodName: food.name,
      mealType,
      portion: portionMultiplier,
      calories: Math.round(food.calories * portionMultiplier),
      protein: Math.round(food.protein * portionMultiplier),
      carbs: Math.round(food.carbs * portionMultiplier),
      fats: Math.round(food.fats * portionMultiplier),
      date: new Date()
    });

    await foodLog.save();
    
    // Check food logging achievements
    await GamificationService.checkFoodLoggingAchievements(req.user.userId);

    res.redirect('/user/food-log?success=' + encodeURIComponent('Food logged successfully!'));

  } catch (error) {
    console.error('Add food log error:', error);
    const user = await User.findById(req.user.userId);
    const foods = await Food.find({ $or: [{ isCustom: false }, { createdBy: req.user.userId }] }).sort({ name: 1 });
    
    res.render('user/food-log', {
      title: 'Food Log - BiteCount',
      user,
      foods,
      success: null,
      errors: [{ msg: 'Error logging food. Please try again.' }]
    });
  }
});

// Add Custom Food
router.post('/food-log/custom', [
  body('name').trim().notEmpty().withMessage('Food name is required'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be 0 or greater'),
  body('protein').isFloat({ min: 0 }).withMessage('Protein must be 0 or greater'),
  body('carbs').isFloat({ min: 0 }).withMessage('Carbs must be 0 or greater'),
  body('fats').isFloat({ min: 0 }).withMessage('Fats must be 0 or greater')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, calories, protein, carbs, fats } = req.body;

    const food = new Food({
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      isCustom: true,
      createdBy: req.user.userId
    });

    await food.save();

    res.json({ success: true, food });

  } catch (error) {
    console.error('Add custom food error:', error);
    res.status(500).json({ success: false, errors: [{ msg: 'Error adding custom food' }] });
  }
});

// Exercise Log Page
router.get('/exercise-log', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    // Get today's exercise logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const exerciseLogs = await ExerciseLog.find({
      userId: req.user.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    const totalCaloriesBurned = exerciseLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalDuration = exerciseLogs.reduce((sum, log) => sum + log.duration, 0);

    res.render('user/exercise-log-enhanced', {
      title: 'Exercise Log - BiteCount',
      currentPage: 'exercise-log',
      user,
      exerciseLogs,
      totalCaloriesBurned,
      totalDuration,
      success: req.query.success || null,
      errors: null
    });

  } catch (error) {
    console.error('Exercise log page error:', error);
    res.status(500).send('Server error');
  }
});

// Add Exercise Log
router.post('/exercise-log', [
  body('exerciseName').trim().notEmpty().withMessage('Exercise name is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('intensity').isIn(['low', 'moderate', 'high']).withMessage('Valid intensity is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const user = await User.findById(req.user.userId);
    
    return res.render('user/exercise-log', {
      title: 'Exercise Log - BiteCount',
      user,
      success: null,
      errors: errors.array()
    });
  }

  try {
    const { exerciseName, duration, intensity } = req.body;
    const user = await User.findById(req.user.userId);

    // Calculate calories burned (simplified formula)
    const intensityMultipliers = {
      low: 3,
      moderate: 5,
      high: 8
    };

    const caloriesBurned = Math.round(parseInt(duration) * intensityMultipliers[intensity] * (user.weight / 70));

    const exerciseLog = new ExerciseLog({
      userId: req.user.userId,
      exerciseName,
      duration: parseInt(duration),
      intensity,
      caloriesBurned,
      date: new Date()
    });

    await exerciseLog.save();
    
    // Check calories burned achievements
    await GamificationService.checkCaloriesBurnedAchievements(req.user.userId);

    res.redirect('/user/exercise-log?success=' + encodeURIComponent(`Exercise logged! You burned approximately ${caloriesBurned} calories.`));

  } catch (error) {
    console.error('Add exercise log error:', error);
    const user = await User.findById(req.user.userId);
    
    res.render('user/exercise-log', {
      title: 'Exercise Log - BiteCount',
      user,
      success: null,
      errors: [{ msg: 'Error logging exercise. Please try again.' }]
    });
  }
});

// Progress Page
router.get('/progress', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    // Get last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const foodLogs = await FoodLog.find({
      userId: req.user.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const exerciseLogs = await ExerciseLog.find({
      userId: req.user.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Aggregate data by day
    const dailyData = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateKey = date.toISOString().split('T')[0];
      
      dailyData[dateKey] = {
        date: dateKey,
        calories: 0,
        burned: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        duration: 0
      };
    }

    foodLogs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].calories += log.calories;
        dailyData[dateKey].protein += log.protein;
        dailyData[dateKey].carbs += log.carbs;
        dailyData[dateKey].fats += log.fats;
      }
    });

    exerciseLogs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].burned += log.caloriesBurned;
        dailyData[dateKey].duration += log.duration;
      }
    });

    const chartData = Object.values(dailyData);

    // Calculate weekly stats
    const avgCalories = Math.round(chartData.reduce((sum, d) => sum + d.calories, 0) / 7);
    const avgBurned = Math.round(chartData.reduce((sum, d) => sum + d.burned, 0) / 7);
    const totalWorkouts = exerciseLogs.length;
    const activeDays = chartData.filter(d => d.calories > 0 || d.burned > 0).length;
    const weeklyProtein = Math.round(chartData.reduce((sum, d) => sum + d.protein, 0));
    const weeklyCarbs = Math.round(chartData.reduce((sum, d) => sum + d.carbs, 0));
    const weeklyFats = Math.round(chartData.reduce((sum, d) => sum + d.fats, 0));

    res.render('user/progress-redesigned', {
      title: 'Progress - BiteCount',
      currentPage: 'progress',
      user,
      chartData,
      avgCalories,
      avgBurned,
      totalWorkouts,
      activeDays,
      weeklyProtein,
      weeklyCarbs,
      weeklyFats
    });

  } catch (error) {
    console.error('Progress page error:', error);
    res.status(500).send('Server error');
  }
});

// Profile Page
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.render('user/profile-redesigned', {
      title: 'Profile - BiteCount',
      currentPage: 'profile',
      user,
      success: null,
      errors: null
    });

  } catch (error) {
    console.error('Profile page error:', error);
    res.status(500).send('Server error');
  }
});

// Update Profile
router.post('/profile', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('height').isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('weight').isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
  body('activityLevel').isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']).withMessage('Valid activity level is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const user = await User.findById(req.user.userId);
    
    return res.render('user/profile-redesigned', {
      title: 'Profile - BiteCount',
      user,
      success: null,
      errors: errors.array()
    });
  }

  try {
    const { fullName, age, height, weight, activityLevel, healthCondition } = req.body;

    const user = await User.findById(req.user.userId);
    
    user.fullName = fullName;
    user.age = parseInt(age);
    user.height = parseFloat(height);
    user.weight = parseFloat(weight);
    user.activityLevel = activityLevel;
    user.healthCondition = healthCondition || '';
    
    // Recalculate calorie goal
    user.calorieGoal = user.calculateTDEE();

    await user.save();

    res.render('user/profile-redesigned', {
      title: 'Profile - BiteCount',
      user,
      success: 'Profile updated successfully!',
      errors: null
    });

  } catch (error) {
    console.error('Update profile error:', error);
    const user = await User.findById(req.user.userId);
    
    res.render('user/profile-redesigned', {
      title: 'Profile - BiteCount',
      user,
      success: null,
      errors: [{ msg: 'Error updating profile. Please try again.' }]
    });
  }
});

// Change Password
router.post('/profile/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, errors: [{ msg: 'Current password is incorrect' }] });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, errors: [{ msg: 'Error changing password' }] });
  }
});

// Helper function to update user streak
async function updateUserStreak(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastActiveDate) {
    user.currentStreak = 1;
    user.lastActiveDate = today;
    await user.save();
    return;
  }

  const lastActive = new Date(user.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no change
    return;
  } else if (daysDiff === 1) {
    // Consecutive day
    user.currentStreak += 1;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
  } else {
    // Streak broken
    user.currentStreak = 1;
  }

  user.lastActiveDate = today;
  await user.save();
  
  // Check streak achievements
  await GamificationService.checkStreakAchievements(user._id, user.currentStreak);
}

// Achievements & Rewards Page
router.get('/achievements', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const achievements = await Achievement.find({ userId: req.user.userId }).sort({ completed: -1, milestone: 1 });
    const progressSummary = await GamificationService.getProgressSummary(req.user.userId);
    
    res.render('user/achievements', {
      title: 'Achievements & Rewards - BiteCount',
      currentPage: 'achievements',
      user,
      achievements,
      progressSummary
    });
    
  } catch (error) {
    console.error('Achievements page error:', error);
    res.status(500).send('Server error');
  }
});

// Water Intake Routes
router.get('/water-intake', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let waterLog = await WaterIntake.findOne({
      userId: req.user.userId,
      date: today
    });
    
    if (!waterLog) {
      waterLog = new WaterIntake({
        userId: req.user.userId,
        date: today,
        target: user.dailyTargets.waterIntake * 2 // Convert glasses to half-glasses
      });
      await waterLog.save();
    }
    
    res.json({
      glasses: waterLog.glasses,
      target: waterLog.target,
      percentage: Math.round((waterLog.glasses / waterLog.target) * 100)
    });
    
  } catch (error) {
    console.error('Water intake get error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/water-intake/add', async (req, res) => {
  try {
    const { amount } = req.body; // 0.5 for half glass, 1 for full glass
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let waterLog = await WaterIntake.findOne({
      userId: req.user.userId,
      date: today
    });
    
    if (!waterLog) {
      const user = await User.findById(req.user.userId);
      waterLog = new WaterIntake({
        userId: req.user.userId,
        date: today,
        target: user.dailyTargets.waterIntake * 2
      });
    }
    
    waterLog.glasses += parseFloat(amount) * 2; // Convert to half-glasses
    waterLog.logs.push({
      amount: parseFloat(amount),
      timestamp: new Date()
    });
    
    await waterLog.save();
    
    // Check water intake achievements
    await GamificationService.checkWaterIntakeAchievements(req.user.userId);
    
    res.json({
      success: true,
      glasses: waterLog.glasses,
      target: waterLog.target,
      percentage: Math.round((waterLog.glasses / waterLog.target) * 100)
    });
    
  } catch (error) {
    console.error('Water intake add error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/water-intake/reset', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await WaterIntake.findOneAndUpdate(
      { userId: req.user.userId, date: today },
      { glasses: 0, logs: [] }
    );
    
    res.json({ success: true, glasses: 0 });
    
  } catch (error) {
    console.error('Water intake reset error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Daily Targets
router.post('/targets/update', async (req, res) => {
  try {
    const { caloriesBurn, waterIntake, steps } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (caloriesBurn) user.dailyTargets.caloriesBurn = parseInt(caloriesBurn);
    if (waterIntake) user.dailyTargets.waterIntake = parseInt(waterIntake);
    if (steps) user.dailyTargets.steps = parseInt(steps);
    
    await user.save();
    
    res.json({ success: true, message: 'Targets updated successfully' });
    
  } catch (error) {
    console.error('Update targets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
