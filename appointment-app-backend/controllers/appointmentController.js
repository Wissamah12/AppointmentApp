const Appointment = require("../models/Appointment");

// GET all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create a new appointment
const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      date: req.body.date,
      time: req.body.time,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findOne({ id: id });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    console.error("Error retrieving appointment:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the appointment" });
  }
};
// PUT update an existing appointment
const updateAppointment = (req, res) => {
  const { id } = req.params;
  const updates = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    date: req.body.date,
    time: req.body.time,
  };

  Appointment.findOneAndUpdate({ id: id }, updates, { new: true })
    .then((appointment) => {
      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }

      res.send("Appointment updated successfully");
    })
    .catch((err) => {
      res.status(500).send("An error occurred while updating the book");
    });
};

// DELETE delete an appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  Appointment.findOneAndDelete({ id: id })
    .then((appointment) => {
      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }

      res.send("Appointment deleted successfully");
    })
    .catch((err) => {
      res.status(500).send("An error occurred while deleting the book");
    });
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
