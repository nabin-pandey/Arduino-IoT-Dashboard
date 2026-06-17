const express = require("express");

const router = express.Router();

const {
  addSensorData,
  getSensorData,
  emitSensorData
} = require("../controller/sensorController");

router.post("/data", addSensorData);

router.get("/data", getSensorData);
router.get("/emit", emitSensorData);

module.exports = router;