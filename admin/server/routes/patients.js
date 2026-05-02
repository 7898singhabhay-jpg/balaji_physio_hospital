const express = require('express');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, phone, prescription, notes } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const patient = await Patient.create({ name, email, phone, prescription, notes, photoUrl });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, phone, prescription, notes } = req.body;
    const update = { name, email, phone, prescription, notes };
    if (req.file) update.photoUrl = `/uploads/${req.file.filename}`;
    const patient = await Patient.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
