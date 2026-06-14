const express = require("express");

const router = express.Router();

const {
  addSensorData,
  getSensorData
} = require("../controller/sensorController");

router.post("/data", addSensorData);

router.get("/data", getSensorData);

module.exports = router;