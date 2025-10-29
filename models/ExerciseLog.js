const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseName: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
exerciseLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);
