import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { customer } = useAuth();
  if (!customer) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
