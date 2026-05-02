import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { shopkeeper } = useAdminAuth();
  if (!shopkeeper) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminProtectedRoute;
