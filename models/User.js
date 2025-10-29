const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number,
    required: true // in cm
  },
  weight: {
    type: Number,
    required: true // in kg
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
  },
  healthCondition: {
    type: String,
    default: ''
  },
  calorieGoal: {
    type: Number,
    default: 2000
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: null
  },
  // Gamification fields
  totalPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date
  }],
  dailyTargets: {
    caloriesBurn: {
      type: Number,
      default: 300
    },
    waterIntake: {
      type: Number,
      default: 8 // 8 glasses
    },
    steps: {
      type: Number,
      default: 10000
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
userSchema.methods.calculateBMR = function() {
  let bmr;
  if (this.gender === 'male') {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
  } else {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
  }
  return bmr;
};

// Calculate TDEE (Total Daily Energy Expenditure)
userSchema.methods.calculateTDEE = function() {
  const bmr = this.calculateBMR();
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  
  return Math.round(bmr * activityMultipliers[this.activityLevel]);
};

module.exports = mongoose.model('User', userSchema);
