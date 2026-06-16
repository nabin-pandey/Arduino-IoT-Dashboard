const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/IOT';

console.log('Using MONGODB_URI =', MONGODB_URI);
console.log('Using PORT =', PORT);

app.use(cors());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log('>>>', req.method, req.url, 'Content-Type:', req.headers['content-type']);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

mongoose.connect(MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error('MongoDB connection error:', err));

//Test 
app.get("/", (req, res) => {
    res.send("API is running");
});

// Sensor Routes
app.use("/api/sensor", require("./routes/SensorRoutes"));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});