import { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../api/api';

const AppointmentForm = ({ appointment, patients, doctors, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    patientId: appointment?.patient?._id || '',
    date: appointment?.date ? appointment.date.split('T')[0] : '',
    time: appointment?.time || '',
    doctor: appointment?.doctor || '',
    status: appointment?.status || 'pending',
    notes: appointment?.notes || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      patientId: appointment?.patient?._id || '',
      date: appointment?.date ? appointment.date.split('T')[0] : '',
      time: appointment?.time || '',
      doctor: appointment?.doctor || '',
      status: appointment?.status || 'pending',
      notes: appointment?.notes || '',
    });
  }, [appointment]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = appointment ? `/appointments/${appointment._id}` : '/appointments';
      const method = appointment ? 'put' : 'post';
      await api[method](endpoint, form);
      setLoading(false);
      onSaved();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {appointment ? 'Edit Appointment' : 'New Appointment'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField select label="Patient" name="patientId" value={form.patientId} onChange={handleChange} required>
          {patients.map((patient) => (
            <MenuItem key={patient._id} value={patient._id}>{patient.name}</MenuItem>
          ))}
        </TextField>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField type="date" label="Date" name="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required fullWidth />
          <TextField label="Time" name="time" value={form.time} onChange={handleChange} required fullWidth />
        </Stack>
        <TextField select label="Doctor" name="doctor" value={form.doctor} onChange={handleChange} required fullWidth>
          {doctors.length ? doctors.map((doctor) => (
            <MenuItem key={doctor._id} value={doctor.name}>{doctor.name}</MenuItem>
          )) : (
            <MenuItem value="">No doctors available</MenuItem>
          )}
        </TextField>
        <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
          {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>
        <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} rows={3} multiline fullWidth />
        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button type="submit" variant="contained" disabled={loading || !form.doctor}>
            {appointment ? 'Save Appointment' : 'Create Appointment'}
          </Button>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default AppointmentForm;
