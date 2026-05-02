const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient').sort({ date: -1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientId, date, time, doctor, status, notes } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const appointment = await Appointment.create({ patient: patientId, date, time, doctor, status, notes });
    res.status(201).json(await appointment.populate('patient'));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const update = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true }).populate('patient');
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
