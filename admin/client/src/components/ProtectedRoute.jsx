import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const authenticated = Boolean(localStorage.getItem('adminToken'));
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
