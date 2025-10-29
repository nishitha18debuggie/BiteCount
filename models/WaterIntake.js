const mongoose = require('mongoose');

const waterIntakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return date;
    }
  },
  glasses: {
    type: Number,
    default: 0,
    min: 0,
    max: 16 // 8 full glasses = 16 half glasses
  },
  target: {
    type: Number,
    default: 16 // 8 full glasses
  },
  logs: [{
    amount: {
      type: Number, // 0.5 for half glass, 1 for full glass
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
waterIntakeSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('WaterIntake', waterIntakeSchema);
