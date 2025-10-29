const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { redirectIfAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { title: 'Login - BiteCount', error: null });
});

// Register Page
router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', { title: 'Register - BiteCount', errors: null });
});

// Handle Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('login', {
      title: 'Login - BiteCount',
      error: 'Please provide valid credentials'
    });
  }

  try {
    const { email, password } = req.body;

    // Check for admin login
    if (email === process.env.ADMIN_EMAIL_LOGIN && password === process.env.ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      req.session.adminEmail = email;
      return res.redirect('/admin/dashboard');
    }

    // Check for user login
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('login', {
        title: 'Login - BiteCount',
        error: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.render('login', {
        title: 'Login - BiteCount',
        error: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect('/user/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login - BiteCount',
      error: 'An error occurred. Please try again.'
    });
  }
});

// Handle Registration
router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('height').isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('weight').isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
  body('activityLevel').isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']).withMessage('Valid activity level is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('register', {
      title: 'Register - BiteCount',
      errors: errors.array()
    });
  }

  try {
    const { fullName, email, password, age, gender, height, weight, activityLevel, healthCondition } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Register - BiteCount',
        errors: [{ msg: 'Email already registered' }]
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
      healthCondition: healthCondition || ''
    });

    // Calculate and set calorie goal
    user.calorieGoal = user.calculateTDEE();

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect('/user/dashboard');

  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', {
      title: 'Register - BiteCount',
      errors: [{ msg: 'An error occurred. Please try again.' }]
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
