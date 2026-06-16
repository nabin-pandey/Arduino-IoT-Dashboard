const SensorData = require("../models/SensorData");

const addSensorData = async (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({
            message: "Temperature and Humidity are required fields."
        });
    }

    if (temperature < 0 || temperature > 100) {
        return res.status(400).json({
            message: "Temperature must be between 0 and 100 °C."
        });
    }

    if (humidity < 0 || humidity > 100) {
        return res.status(400).json({
            message: "Humidity must be between 0 and 100 %."
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
        const data = await SensorData.find();
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