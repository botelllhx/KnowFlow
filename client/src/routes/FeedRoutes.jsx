import { Route } from 'react-router-dom';
import Feed from '../pages/Feed';
import ProtectedRoute from './ProtectedRoute';

const FeedRoutes = () => (
  <>
    <Route
      path="/feed"
      element={<ProtectedRoute><Feed /></ProtectedRoute>}
    />
  </>
);

export default FeedRoutes;
