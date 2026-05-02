import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';
import PatientForm from '../components/PatientForm';
import api from '../api/api';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const loadPatients = async () => {
    const response = await api.get('/patients');
    setPatients(response.data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/patients/${id}`);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (selectedPatient?._id === id) {
      setSelectedPatient(null);
      setOpenForm(false);
    }
    loadPatients();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => api.delete(`/patients/${id}`)));
    setSelectedIds([]);
    if (selectedPatient && selectedIds.includes(selectedPatient._id)) {
      setSelectedPatient(null);
      setOpenForm(false);
    }
    loadPatients();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(patients.map((patient) => patient._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedPatient(null);
    setOpenForm(true);
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setOpenForm(false);
  };

  const handleSaved = () => {
    setSelectedPatient(null);
    setOpenForm(false);
    loadPatients();
  };

  return (
    <Layout title="Patient Management">
      <Stack spacing={2}>
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Patients List
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
                    checked={selectedIds.length === patients.length && patients.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < patients.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email / Phone</TableCell>
                <TableCell>Prescription</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient._id} hover selected={selectedIds.includes(patient._id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedIds.includes(patient._id)} onChange={() => handleSelectOne(patient._id)} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={patient.photoUrl ? `http://localhost:5000${patient.photoUrl}` : undefined} sx={{ width: 36, height: 36 }}>
                        {patient.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>{patient.name}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{patient.email || patient.phone || '—'}</TableCell>
                  <TableCell>{patient.prescription || '—'}</TableCell>
                  <TableCell>{patient.notes || '—'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(patient)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(patient._id)}>
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
        <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Create Patient'}</DialogTitle>
        <DialogContent dividers>
          <PatientForm patient={selectedPatient} onSaved={handleSaved} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PatientsPage;
