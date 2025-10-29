const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['streak', 'calories_burned', 'water_intake', 'weight_loss', 'consistency', 'food_logged'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  milestone: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  reward: {
    points: {
      type: Number,
      default: 0
    },
    badge: {
      type: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
