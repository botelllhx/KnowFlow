import { Route } from "react-router-dom";
import Workspaces from "../pages/Workspaces";
import WorkspaceDetail from "../pages/WorkspaceDetail";
import ProtectedRoute from "./ProtectedRoute";

const WorkspaceRoutes = () => (
  <>
    <Route
      path="/workspaces"
      element={
        <ProtectedRoute>
          <Workspaces />
        </ProtectedRoute>
      }
    />
    <Route
      path="/workspace/:id"
      element={
        <ProtectedRoute>
          <WorkspaceDetail />
        </ProtectedRoute>
      }
    />
  </>
);

export default WorkspaceRoutes;
