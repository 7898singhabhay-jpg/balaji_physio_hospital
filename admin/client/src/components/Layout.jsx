import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Container, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Dashboard, People, Event, MedicalServices, Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Patients', path: '/patients', icon: <People /> },
  { label: 'Appointments', path: '/appointments', icon: <Event /> },
  { label: 'Doctors', path: '/doctors', icon: <MedicalServices /> },
];

const Layout = ({ title, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, bgcolor: '#f8fafc', height: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Balaji Admin
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path} onClick={() => isMobile && setMobileOpen(false)}>
              <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon sx={{ color: 'primary.main' }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#eef2ff' }}>
      <AppBar position="fixed" elevation={3} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#0f172a' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Balaji Physio Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0,0,0,0.08)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3, flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
            {title}
          </Typography>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 2, px: 3, bgcolor: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.08)', mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2026 Balaji Physio Admin. Clean and simple appointment system dashboard.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
