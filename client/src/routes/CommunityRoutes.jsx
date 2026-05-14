import { Route } from 'react-router-dom';
import { Community } from '../pages/Community';
import { PostPage } from '../pages/PostPage';
import ProtectedRoute from './ProtectedRoute';

const CommunityRoutes = () => (
  <>
    <Route
      path="/comunidade"
      element={<ProtectedRoute><Community /></ProtectedRoute>}
    />
    <Route
      path="/post/:id"
      element={<ProtectedRoute><PostPage /></ProtectedRoute>}
    />
  </>
);

export default CommunityRoutes;
