import { Route } from 'react-router-dom';
import FlowEditor from '../pages/FlowEditor';
import FlowViewer from '../pages/FlowViewer';
import ProtectedRoute from './ProtectedRoute';

const FlowRoutes = () => (
  <>
    <Route
      path="/criar-flow"
      element={<ProtectedRoute><FlowEditor /></ProtectedRoute>}
    />
    <Route
      path="/editar-flow/:id"
      element={<ProtectedRoute><FlowEditor /></ProtectedRoute>}
    />
    <Route path="/flow/:id" element={<FlowViewer />} />
  </>
);

export default FlowRoutes;
