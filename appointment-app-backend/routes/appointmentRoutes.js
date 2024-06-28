const express = require("express");
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

// Define routes
router.get("/appointments", getAppointments);
router.get("/appointments/:id", getAppointment);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

module.exports = router;
