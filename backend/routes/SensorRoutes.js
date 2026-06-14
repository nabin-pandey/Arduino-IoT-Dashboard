const express = require("express");
const router = express.Router();

const Sensor = require("../models/SensorData");

router.post("/data", async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    const newData = new Sensor({
      temperature,
      humidity
    });

    await newData.save();

    res.status(201).json({
      success: true,
      message: "Data saved"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/data", async (req, res) => {
  const data = await Sensor.find().sort({ createdAt: -1 });

  res.json(data);
});

module.exports = router;