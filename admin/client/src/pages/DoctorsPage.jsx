import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';
import DoctorForm from '../components/DoctorForm';
import api from '../api/api';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const loadDoctors = async () => {
    const response = await api.get('/doctors');
    setDoctors(response.data);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/doctors/${id}`);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (selectedDoctor?._id === id) {
      setSelectedDoctor(null);
      setOpenForm(false);
    }
    loadDoctors();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => api.delete(`/doctors/${id}`)));
    setSelectedIds([]);
    if (selectedDoctor && selectedIds.includes(selectedDoctor._id)) {
      setSelectedDoctor(null);
      setOpenForm(false);
    }
    loadDoctors();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(doctors.map((doctor) => doctor._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedDoctor(null);
    setOpenForm(true);
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setOpenForm(false);
  };

  const handleSaved = () => {
    setSelectedDoctor(null);
    setOpenForm(false);
    loadDoctors();
  };

  return (
    <Layout title="Doctor Management">
      <Stack spacing={2}>
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Doctors List
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button startIcon={<AddIcon />} variant="contained" onClick={handleAdd}>
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
                    checked={selectedIds.length === doctors.length && doctors.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < doctors.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Specialty</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id} hover selected={selectedIds.includes(doctor._id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedIds.includes(doctor._id)} onChange={() => handleSelectOne(doctor._id)} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={doctor.photoUrl ? `http://localhost:5000${doctor.photoUrl}` : undefined} sx={{ width: 36, height: 36 }}>
                        {doctor.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>{doctor.name}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{doctor.specialty || '—'}</TableCell>
                  <TableCell>{doctor.email || '—'}</TableCell>
                  <TableCell>{doctor.phone || '—'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(doctor)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(doctor._id)}>
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
        <DialogTitle>{selectedDoctor ? 'Edit Doctor' : 'Create Doctor'}</DialogTitle>
        <DialogContent dividers>
          <DoctorForm doctor={selectedDoctor} onSaved={handleSaved} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DoctorsPage;
