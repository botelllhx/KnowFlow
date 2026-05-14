import { Route } from "react-router-dom";
import Pulse from "../pages/Pulse";
import ProtectedRoute from "./ProtectedRoute";

const PulseRoutes = () => (
  <>
    <Route
      path="/pulse"
      element={
        <ProtectedRoute>
          <Pulse />
        </ProtectedRoute>
      }
    />
  </>
);

export default PulseRoutes;
