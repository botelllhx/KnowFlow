import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Auth/Landing';
import NotFound from '../pages/NotFound';
import FlowRoutes from './FlowRoutes';
import AuthRoutes from './AuthRoutes';
import CommunityRoutes from './CommunityRoutes';
import FeedRoutes from './FeedRoutes';
import ProfileRoutes from './ProfileRoutes';
import PulseRoutes from './PulseRoutes';
import DashboardRoutes from './DashboardRoutes';
import WorkspaceRoutes from './WorkspaceRoutes';
import AnalyticsRoutes from './AnalyticsRoutes';
import SearchRoutes from './SearchRoutes';

const MainRoutes = () => (
  <Routes>
    {/* Pública */}
    <Route path="/" element={<Landing />} />

    {/* Auth */}
    {AuthRoutes()}

    {/* Autenticadas */}
    {FlowRoutes()}
    {CommunityRoutes()}
    {FeedRoutes()}
    {ProfileRoutes()}
    {PulseRoutes()}
    {DashboardRoutes()}
    {WorkspaceRoutes()}
    {AnalyticsRoutes()}
    {SearchRoutes()}

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default MainRoutes;
