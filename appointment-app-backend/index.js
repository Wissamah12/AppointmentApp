require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const appointmentRoutes = require("./routes/appointmentRoutes");

const cors = require("cors");
// initializers
const app = express();
// CORS
app.use(cors());
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// routes

app.use("/api", appointmentRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://192.168.0.110:${port}`);
});
