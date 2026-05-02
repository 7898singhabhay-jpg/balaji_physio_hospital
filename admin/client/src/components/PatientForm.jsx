import { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import api from '../api/api';
import ImageUploadWithCrop from './ImageUploadWithCrop';

const PatientForm = ({ patient, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    prescription: patient?.prescription || '',
    notes: patient?.notes || '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      prescription: patient?.prescription || '',
      notes: patient?.notes || '',
    });
    setFile(null);
  }, [patient]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (file) formData.append('photo', file);
      const endpoint = patient ? `/patients/${patient._id}` : '/patients';
      const method = patient ? 'put' : 'post';
      await api[method](endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLoading(false);
      onSaved();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, py: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {patient ? 'Edit Patient' : 'Add New Patient'}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
        <TextField label="Prescription" name="prescription" value={form.prescription} onChange={handleChange} fullWidth />
      </Stack>
      <ImageUploadWithCrop
        initialImage={patient?.photoUrl ? `http://localhost:5000${patient.photoUrl}` : ''}
        onFileChange={setFile}
        label="Patient Photo"
      />
      <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} rows={3} multiline fullWidth />
      <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
        <Button type="submit" variant="contained" disabled={loading}>
          {patient ? 'Save Changes' : 'Add Patient'}
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default PatientForm;
