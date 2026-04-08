import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { JobsProvider } from "./context/JobsContext";
import { CandidateProvider } from "./context/CandidateContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import DashboardPage from "./pages/DashboardPage";
import Dashboard from "./pages/Dashboard";
import NewJob from "./pages/NewJob";
import JobDetail from "./pages/JobDetail";
import PipelinePage from "./pages/PipelinePage";
import PipelineOverviewPage from "./pages/PipelineOverviewPage";
import CandidatesPage from "./pages/CandidatesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import CandidateResume from "./pages/CandidateResume";
import CandidateAssessment from "./pages/CandidateAssessment";

export default function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <CandidateProvider>
          <Routes>
            {/* Public — no layout, no protection */}
            <Route path="/login" element={<LoginPage />} />

            {/* Welcome — full-page, protected only by auth (not ProtectedRoute, which would loop) */}
            <Route path="/welcome" element={<WelcomePage />} />

            {/* All app routes — sidebar layout + ProtectedRoute per page */}
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/jobs" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/jobs/new" element={<ProtectedRoute><NewJob /></ProtectedRoute>} />
                    <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId/pipeline" element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId/candidates/:candidateId/resume" element={<ProtectedRoute><CandidateResume /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId/candidates/:candidateId/assessment" element={<ProtectedRoute><CandidateAssessment /></ProtectedRoute>} />
                    <Route path="/candidates" element={<ProtectedRoute><CandidatesPage /></ProtectedRoute>} />
                    <Route path="/pipeline" element={<ProtectedRoute><PipelineOverviewPage /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </CandidateProvider>
      </JobsProvider>
    </AuthProvider>
  );
}
