const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

//Temporary test route
mongoose.connection.once("open", () => {
  console.log("DB NAME:", mongoose.connection.db.databaseName);
});

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use((req, res, next) => {
  console.log("GLOBAL BODY CHECK:", req.body);
  next();
});

app.use("/api/sensor", require("./routes/SensorRoutes"));

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});