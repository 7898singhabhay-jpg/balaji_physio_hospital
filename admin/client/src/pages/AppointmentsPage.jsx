import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Checkbox, Chip, Dialog, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';
import AppointmentForm from '../components/AppointmentForm';
import api from '../api/api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const loadAppointments = async () => {
    const response = await api.get('/appointments');
    setAppointments(response.data);
  };

  const loadPatients = async () => {
    const response = await api.get('/patients');
    setPatients(response.data);
  };

  const loadDoctors = async () => {
    const response = await api.get('/doctors');
    setDoctors(response.data);
  };

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/appointments/${id}`);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (selectedAppointment?._id === id) {
      setSelectedAppointment(null);
      setOpenForm(false);
    }
    loadAppointments();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => api.delete(`/appointments/${id}`)));
    setSelectedIds([]);
    if (selectedAppointment && selectedIds.includes(selectedAppointment._id)) {
      setSelectedAppointment(null);
      setOpenForm(false);
    }
    loadAppointments();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(appointments.map((appointment) => appointment._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedAppointment(null);
    setOpenForm(true);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setOpenForm(false);
  };

  const handleSaved = () => {
    setSelectedAppointment(null);
    setOpenForm(false);
    loadAppointments();
  };

  return (
    <Layout title="Appointment Management">
      <Stack spacing={2}>
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Appointments List
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button startIcon={<AddIcon />} variant="contained" onClick={handleAdd} disabled={!patients.length || !doctors.length}>
                  Create
                </Button>
                <Button startIcon={<DeleteIcon />} variant="outlined" color="error" disabled={!selectedIds.length} onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.length === appointments.length && appointments.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < appointments.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id} hover selected={selectedIds.includes(appointment._id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedIds.includes(appointment._id)} onChange={() => handleSelectOne(appointment._id)} />
                  </TableCell>
                  <TableCell>{appointment.patient?.name || 'Unknown'}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>
                    <Chip label={appointment.status} color={appointment.status === 'confirmed' ? 'success' : appointment.status === 'cancelled' ? 'error' : 'warning'} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(appointment)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(appointment._id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog open={openForm} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedAppointment ? 'Edit Appointment' : 'Create Appointment'}</DialogTitle>
        <DialogContent dividers>
          <AppointmentForm appointment={selectedAppointment} patients={patients} doctors={doctors} onSaved={handleSaved} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AppointmentsPage;
