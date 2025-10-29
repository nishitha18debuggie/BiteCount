const User = require('../models/User');
const Achievement = require('../models/Achievement');
const ExerciseLog = require('../models/ExerciseLog');
const FoodLog = require('../models/FoodLog');
const WaterIntake = require('../models/WaterIntake');

// Achievement definitions
const ACHIEVEMENTS = {
  // Streak achievements
  STREAK_7: {
    type: 'streak',
    title: '7-Day Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    milestone: 7,
    reward: { points: 100, badge: 'Week Warrior' }
  },
  STREAK_30: {
    type: 'streak',
    title: 'Monthly Champion',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    milestone: 30,
    reward: { points: 500, badge: 'Month Master' }
  },
  STREAK_100: {
    type: 'streak',
    title: 'Century Legend',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    milestone: 100,
    reward: { points: 2000, badge: 'Century King' }
  },
  
  // Calories burned achievements
  BURN_1000: {
    type: 'calories_burned',
    title: 'Calorie Crusher',
    description: 'Burn 1,000 calories in total',
    icon: '🔥',
    milestone: 1000,
    reward: { points: 50, badge: 'Burner' }
  },
  BURN_10000: {
    type: 'calories_burned',
    title: 'Inferno Master',
    description: 'Burn 10,000 calories in total',
    icon: '🌋',
    milestone: 10000,
    reward: { points: 300, badge: 'Inferno' }
  },
  BURN_50000: {
    type: 'calories_burned',
    title: 'Furnace Legend',
    description: 'Burn 50,000 calories in total',
    icon: '⚡',
    milestone: 50000,
    reward: { points: 1000, badge: 'Furnace' }
  },
  
  // Water intake achievements
  WATER_7: {
    type: 'water_intake',
    title: 'Hydration Hero',
    description: 'Meet water goal for 7 days',
    icon: '💧',
    milestone: 7,
    reward: { points: 75, badge: 'Hydrated' }
  },
  WATER_30: {
    type: 'water_intake',
    title: 'Aqua Champion',
    description: 'Meet water goal for 30 days',
    icon: '🌊',
    milestone: 30,
    reward: { points: 400, badge: 'Aqua Master' }
  },
  
  // Consistency achievements
  FOOD_LOGGED_50: {
    type: 'food_logged',
    title: 'Tracking Pro',
    description: 'Log 50 meals',
    icon: '📊',
    milestone: 50,
    reward: { points: 100, badge: 'Tracker' }
  },
  FOOD_LOGGED_200: {
    type: 'food_logged',
    title: 'Logging Legend',
    description: 'Log 200 meals',
    icon: '📈',
    milestone: 200,
    reward: { points: 500, badge: 'Log Master' }
  }
};

class GamificationService {
  // Initialize achievements for a user
  static async initializeAchievements(userId) {
    const existingAchievements = await Achievement.find({ userId });
    
    if (existingAchievements.length === 0) {
      const achievements = Object.values(ACHIEVEMENTS).map(achievement => ({
        userId,
        ...achievement
      }));
      
      await Achievement.insertMany(achievements);
    }
  }
  
  // Check and update streak achievements
  static async checkStreakAchievements(userId, currentStreak) {
    const streakAchievements = await Achievement.find({
      userId,
      type: 'streak',
      completed: false
    });
    
    const newlyCompleted = [];
    
    for (const achievement of streakAchievements) {
      if (currentStreak >= achievement.milestone) {
        achievement.progress = achievement.milestone;
        achievement.completed = true;
        achievement.completedAt = new Date();
        await achievement.save();
        
        await this.awardReward(userId, achievement.reward);
        newlyCompleted.push(achievement);
      } else {
        achievement.progress = currentStreak;
        await achievement.save();
      }
    }
    
    return newlyCompleted;
  }
  
  // Check and update calories burned achievements
  static async checkCaloriesBurnedAchievements(userId) {
    const totalBurned = await ExerciseLog.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } }
    ]);
    
    const total = totalBurned.length > 0 ? totalBurned[0].total : 0;
    
    const calorieAchievements = await Achievement.find({
      userId,
      type: 'calories_burned',
      completed: false
    });
    
    const newlyCompleted = [];
    
    for (const achievement of calorieAchievements) {
      achievement.progress = total;
      
      if (total >= achievement.milestone) {
        achievement.completed = true;
        achievement.completedAt = new Date();
        await this.awardReward(userId, achievement.reward);
        newlyCompleted.push(achievement);
      }
      
      await achievement.save();
    }
    
    return newlyCompleted;
  }
  
  // Check and update water intake achievements
  static async checkWaterIntakeAchievements(userId) {
    const waterLogs = await WaterIntake.find({
      userId,
      glasses: { $gte: 16 } // Met daily goal (8 full glasses)
    });
    
    const daysMetGoal = waterLogs.length;
    
    const waterAchievements = await Achievement.find({
      userId,
      type: 'water_intake',
      completed: false
    });
    
    const newlyCompleted = [];
    
    for (const achievement of waterAchievements) {
      achievement.progress = daysMetGoal;
      
      if (daysMetGoal >= achievement.milestone) {
        achievement.completed = true;
        achievement.completedAt = new Date();
        await this.awardReward(userId, achievement.reward);
        newlyCompleted.push(achievement);
      }
      
      await achievement.save();
    }
    
    return newlyCompleted;
  }
  
  // Check and update food logging achievements
  static async checkFoodLoggingAchievements(userId) {
    const totalLogs = await FoodLog.countDocuments({ userId });
    
    const foodAchievements = await Achievement.find({
      userId,
      type: 'food_logged',
      completed: false
    });
    
    const newlyCompleted = [];
    
    for (const achievement of foodAchievements) {
      achievement.progress = totalLogs;
      
      if (totalLogs >= achievement.milestone) {
        achievement.completed = true;
        achievement.completedAt = new Date();
        await this.awardReward(userId, achievement.reward);
        newlyCompleted.push(achievement);
      }
      
      await achievement.save();
    }
    
    return newlyCompleted;
  }
  
  // Award points and badges
  static async awardReward(userId, reward) {
    const user = await User.findById(userId);
    
    if (!user) return;
    
    user.totalPoints += reward.points;
    
    // Calculate level based on points (every 1000 points = 1 level)
    user.level = Math.floor(user.totalPoints / 1000) + 1;
    
    if (reward.badge) {
      user.badges.push({
        name: reward.badge,
        icon: '🏆',
        earnedAt: new Date()
      });
    }
    
    await user.save();
  }
  
  // Get user's progress summary
  static async getProgressSummary(userId) {
    const user = await User.findById(userId);
    const achievements = await Achievement.find({ userId });
    
    const completed = achievements.filter(a => a.completed).length;
    const total = achievements.length;
    const percentage = Math.round((completed / total) * 100);
    
    return {
      level: user.level,
      totalPoints: user.totalPoints,
      badges: user.badges,
      achievementsCompleted: completed,
      achievementsTotal: total,
      completionPercentage: percentage,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak
    };
  }
}

module.exports = GamificationService;
