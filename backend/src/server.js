const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log('>>>', req.method, req.url, 'Content-Type:', req.headers['content-type']);
  next();
});


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