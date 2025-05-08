import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ResourceListPage from '../pages/ResourceListPage';
import ResourceDetailPage from '../pages/ResourceDetailPage';
import { useAuthStore } from '../store/auth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route
      path="/resources"
      element={
        <ProtectedRoute>
          <ResourceListPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/resources/:id"
      element={
        <ProtectedRoute>
          <ResourceDetailPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
