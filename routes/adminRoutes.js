const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../config/auth');
const User = require('../models/User');
const Food = require('../models/Food');
const FoodLog = require('../models/FoodLog');
const ExerciseLog = require('../models/ExerciseLog');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// Apply authentication middleware to all routes
router.use(authenticateAdmin);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFoods = await Food.countDocuments({ isCustom: false });
    const totalContacts = await Contact.countDocuments({ status: 'new' });

    // Get recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    
    // Calculate average calories consumed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await FoodLog.find({
      date: { $gte: today, $lt: tomorrow }
    });

    const avgCalories = todayLogs.length > 0 
      ? Math.round(todayLogs.reduce((sum, log) => sum + log.calories, 0) / todayLogs.length)
      : 0;

    res.render('admin/dashboard-enhanced', {
      title: 'Admin Dashboard - BiteCount',
      currentPage: 'dashboard',
      adminEmail: req.session.adminEmail,
      totalUsers,
      totalFoods,
      totalContacts,
      avgCalories,
      recentUsers
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).send('Server error');
  }
});

// Manage Users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const searchQuery = search 
      ? { $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]}
      : {};

    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    res.render('admin/users', {
      title: 'Manage Users - BiteCount',
      currentPage: 'users',
      adminEmail: req.session.adminEmail,
      users,
      currentPageNum: page,
      totalPages,
      search,
      success: req.query.success || null
    });

  } catch (error) {
    console.error('Manage users error:', error);
    res.status(500).send('Server error');
  }
});

// Delete User
router.post('/users/delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user and all associated data
    await User.findByIdAndDelete(userId);
    await FoodLog.deleteMany({ userId });
    await ExerciseLog.deleteMany({ userId });
    await Food.deleteMany({ createdBy: userId, isCustom: true });

    res.redirect('/admin/users?success=User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    res.redirect('/admin/users?error=Error deleting user');
  }
});

// Manage Foods
router.get('/foods', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const searchQuery = search 
      ? { name: { $regex: search, $options: 'i' }, isCustom: false }
      : { isCustom: false };

    const foods = await Food.find(searchQuery)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const totalFoods = await Food.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalFoods / limit);

    res.render('admin/foods', {
      title: 'Manage Foods - BiteCount',
      currentPage: 'foods',
      adminEmail: req.session.adminEmail,
      foods,
      currentPageNum: page,
      totalPages,
      search,
      success: req.query.success || null,
      errors: null
    });

  } catch (error) {
    console.error('Manage foods error:', error);
    res.status(500).send('Server error');
  }
});

// Add Food
router.post('/foods/add', [
  body('name').trim().notEmpty().withMessage('Food name is required'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be 0 or greater'),
  body('protein').isFloat({ min: 0 }).withMessage('Protein must be 0 or greater'),
  body('carbs').isFloat({ min: 0 }).withMessage('Carbs must be 0 or greater'),
  body('fats').isFloat({ min: 0 }).withMessage('Fats must be 0 or greater')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const foods = await Food.find({ isCustom: false }).sort({ name: 1 }).limit(20);
    
    return res.render('admin/foods', {
      title: 'Manage Foods - BiteCount',
      currentPage: 'foods',
      adminEmail: req.session.adminEmail,
      foods,
      currentPageNum: 1,
      totalPages: 1,
      search: '',
      success: null,
      errors: errors.array()
    });
  }

  try {
    const { name, calories, protein, carbs, fats, servingSize, category } = req.body;

    const food = new Food({
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      servingSize: servingSize || '100g',
      category: category || 'Other',
      isCustom: false
    });

    await food.save();
    res.redirect('/admin/foods?success=Food added successfully');

  } catch (error) {
    console.error('Add food error:', error);
    res.redirect('/admin/foods?error=Error adding food');
  }
});

// Delete Food
router.post('/foods/delete/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect('/admin/foods?success=Food deleted successfully');

  } catch (error) {
    console.error('Delete food error:', error);
    res.redirect('/admin/foods?error=Error deleting food');
  }
});

// Reports
router.get('/reports', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Get last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const foodLogs = await FoodLog.find({
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const exerciseLogs = await ExerciseLog.find({
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
        users: 0
      };
    }

    foodLogs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].calories += log.calories;
      }
    });

    exerciseLogs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].burned += log.caloriesBurned;
      }
    });

    const chartData = Object.values(dailyData);

    const usersWithStreaks = await User.find({ currentStreak: { $gt: 0 } });
    const totalActiveStreaks = usersWithStreaks.length;

    res.render('admin/reports', {
      title: 'Reports & Analytics - BiteCount',
      currentPage: 'reports',
      adminEmail: req.session.adminEmail,
      totalUsers,
      totalActiveStreaks,
      chartData
    });

  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).send('Server error');
  }
});

// Manage Contacts
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const status = req.query.status || 'all';
    const statusQuery = status === 'all' ? {} : { status };

    const contacts = await Contact.find(statusQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalContacts = await Contact.countDocuments(statusQuery);
    const totalPages = Math.ceil(totalContacts / limit);

    res.render('admin/contacts', {
      title: 'Contact Queries - BiteCount',
      currentPage: 'contacts',
      adminEmail: req.session.adminEmail,
      contacts,
      currentPageNum: page,
      totalPages,
      status,
      success: req.query.success || null
    });

  } catch (error) {
    console.error('Contacts error:', error);
    res.status(500).send('Server error');
  }
});

// Mark Contact as Read
router.post('/contacts/mark-read/:id', async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.redirect('/admin/contacts?success=Contact marked as read');

  } catch (error) {
    console.error('Mark contact error:', error);
    res.redirect('/admin/contacts?error=Error updating contact');
  }
});

// Delete Contact
router.post('/contacts/delete/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/contacts?success=Contact deleted successfully');

  } catch (error) {
    console.error('Delete contact error:', error);
    res.redirect('/admin/contacts?error=Error deleting contact');
  }
});

module.exports = router;
