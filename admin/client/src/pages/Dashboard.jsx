import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Layout from '../components/Layout';
import api from '../api/api';
import slide1 from '../assets/images/slide1.svg';
import slide2 from '../assets/images/slide2.svg';
import slide3 from '../assets/images/slide3.svg';

const slides = [
  { image: slide1, title: 'Patient Care First', subtitle: 'Modern physiotherapy for every body.' },
  { image: slide2, title: 'Trusted Experts', subtitle: 'Skilled doctors and friendly staff.' },
  { image: slide3, title: 'Healthy Recovery', subtitle: 'Restore mobility with personalized therapy.' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [stats, setStats] = useState({ patients: 0, appointments: 0, doctors: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/appointments'),
          api.get('/doctors'),
        ]);
        setStats({
          patients: patientsRes.data.length,
          appointments: appointmentsRes.data.length,
          doctors: doctorsRes.data.length,
        });
        setRecentAppointments(appointmentsRes.data.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  return (
    <Layout title="Dashboard">
      <Box sx={{ position: 'relative', height: { xs: 280, md: 420 }, borderRadius: 3, overflow: 'hidden', mb: 4, boxShadow: 4 }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${slides[activeSlide].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(15,23,42,0.55)' }} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Box sx={{ textAlign: 'center', color: '#fff', maxWidth: 680 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {slides[activeSlide].title}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              {slides[activeSlide].subtitle}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" color="primary" sx={{ minWidth: 150 }} onClick={() => navigate('/patients')}>
                View Patients
              </Button>
              <Button variant="outlined" color="inherit" sx={{ minWidth: 150, borderColor: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/appointments')}>
                Manage Appointments
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.patients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Appointments
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.appointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Doctors
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.doctors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Recent Appointments
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAppointments.length ? recentAppointments.map((appointment) => (
                      <TableRow key={appointment._id}>
                        <TableCell>{appointment.patient?.name || 'Unknown'}</TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                          No appointments available yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button variant="contained" onClick={() => navigate('/appointments')}>
                  Create Appointment
                </Button>
                <Button variant="outlined" onClick={() => navigate('/doctors')}>
                  Add Doctor
                </Button>
                <Button variant="outlined" onClick={() => navigate('/patients')}>
                  View Patients
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
