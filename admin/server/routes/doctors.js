const express = require('express');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, phone, specialty, notes } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const doctor = await Doctor.create({ name, email, phone, specialty, notes, photoUrl });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, phone, specialty, notes } = req.body;
    const update = { name, email, phone, specialty, notes };
    if (req.file) update.photoUrl = `/uploads/${req.file.filename}`;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
