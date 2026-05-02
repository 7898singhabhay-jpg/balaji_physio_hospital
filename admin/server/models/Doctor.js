const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  specialty: { type: String },
  photoUrl: { type: String },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
