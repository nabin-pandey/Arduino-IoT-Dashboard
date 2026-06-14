const SensorData = require("../models/SensorData");

const addSensorData = async (req, res) => {
  const { temperature, humidity } = req.body || {};

  if (temperature === undefined || humidity === undefined) {
    return res.status(400).json({
      message: "temperature and humidity are required",
      receivedBody: req.body
    });
  }

  try {
    const data = await SensorData.create({ temperature, humidity });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getSensorData = async (req, res) => {
  try {
    const recentSeconds = parseInt(req.query.recentSeconds, 10);
    const query = {};

    if (!Number.isNaN(recentSeconds) && recentSeconds > 0) {
      query.createdAt = { $gte: new Date(Date.now() - recentSeconds * 1000) };
    }

    const data = await SensorData.find(query).sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addSensorData,
  getSensorData
};