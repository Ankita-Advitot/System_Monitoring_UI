import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginContainer } from '@/features/auth/login/containers/LoginContainer';
import { RegisterContainer } from '@/features/auth/register/containers/RegisterContainer';
import { DashboardContainer } from '@/features/dashboard/containers/DashboardContainer';
import { ThresholdContainer } from '@/features/thresholds/containers/ThresholdContainer';
import { SpikeSimulationContainer } from '@/features/spikeSimulation/containers/SpikeSimulationContainer';
import { SidebarLayout } from '@/app/layout/SidebarLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/app/*"
          element={
            <SidebarLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardContainer />} />
                <Route path="thresholds" element={<ThresholdContainer />} />
                <Route path="spike-simulation" element={<SpikeSimulationContainer />} />
              </Routes>
            </SidebarLayout>
          }
        />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
