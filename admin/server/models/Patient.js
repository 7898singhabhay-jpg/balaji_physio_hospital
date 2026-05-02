const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  photoUrl: { type: String },
  prescription: { type: String },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
