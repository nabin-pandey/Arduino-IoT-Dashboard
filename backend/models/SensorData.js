const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
      index: true, // Indexing for faster queries on timestamp
      expires: '30d', // 30 days  to automatically delete old data
    },
    temperature: {
      type: Number,
      required: true,
      min: -50,
      max: 150,
      description: 'Temperature in Celsius',
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      description: 'Relative humidity in percentage',
    },
  },
  {
    timestamps: true, 
    collection: 'sensor_logs',
  }
);

// Add compound index for efficient time-range queries
SensorDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('SensorData', SensorDataSchema);
