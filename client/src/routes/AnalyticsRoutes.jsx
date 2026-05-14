import { Route } from 'react-router-dom';
import Analytics from '../pages/Analytics';
import ProtectedRoute from './ProtectedRoute';

const AnalyticsRoutes = () => (
  <>
    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }
    />
  </>
);

export default AnalyticsRoutes;
