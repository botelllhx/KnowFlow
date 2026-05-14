import { Route } from 'react-router-dom';
import Profile from '../pages/Profile';
import ProtectedRoute from './ProtectedRoute';

const ProfileRoutes = () => (
  <>
    <Route
      path="/perfil"
      element={<ProtectedRoute><Profile /></ProtectedRoute>}
    />
  </>
);

export default ProfileRoutes;
