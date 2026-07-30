import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardHome from '../pages/dashboard/Home';
import Marketplace from '../pages/marketplace/Marketplace';
import Events from '../pages/events/Events';
import Clubs from '../pages/clubs/Clubs';
import ClubDetail from '../pages/clubs/ClubDetail';
import Placements from '../pages/placements/Placements';
import Pyqs from '../pages/pyqs/Pyqs';
import LostFound from '../pages/lostfound/LostFound';
import Profile from '../pages/profile/Profile';
import ResumeBuilder from '../pages/resume/ResumeBuilder';
import Settings from '../pages/settings/Settings';
import { NotificationsPage } from '../features/notifications';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminClubs from '../pages/admin/AdminClubs';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="events" element={<Events />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="clubs/:clubId" element={<ClubDetail />} />
              <Route path="placements" element={<Placements />} />
              <Route path="pyqs" element={<Pyqs />} />
              <Route path="lost-found" element={<LostFound />} />
              <Route path="resume" element={<ResumeBuilder />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<NotificationsPage />} />

              <Route path="admin" element={<AdminRoute />}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="clubs" element={<AdminClubs />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
