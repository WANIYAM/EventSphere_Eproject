import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ServerStatusBanner from "./components/ServerStatusBanner.jsx";

// Public Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";

// Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ExhibitorDashboard from "./pages/ExhibitorDashboard.jsx";
import AttendeeDashboard from "./pages/AttendeeDashboard.jsx";

// Phase 3 Pages
import AdminExpos from "./pages/admin/AdminExpos.jsx";
import AdminBooths from "./pages/admin/AdminBooths.jsx";
import AdminApplications from "./pages/admin/AdminApplications.jsx";
import ExhibitorExpos from "./pages/exhibitor/ExhibitorExpos.jsx";
import MyApplications from "./pages/exhibitor/MyApplications.jsx";

// Phase 4 Pages
import AdminSessions from "./pages/admin/AdminSessions.jsx";
import ExhibitorProfile from "./pages/exhibitor/ExhibitorProfile.jsx";
import ExhibitorBooths from "./pages/exhibitor/ExhibitorBooths.jsx";
import Messages from "./pages/Messages.jsx";

// Phase 5 & 6 Pages
import AttendeeExpos from "./pages/attendee/AttendeeExpos.jsx";
import ExpoDetails from "./pages/attendee/ExpoDetails.jsx";
import ExhibitorProfileView from "./pages/attendee/ExhibitorProfileView.jsx";
import MySchedule from "./pages/attendee/MySchedule.jsx";
import Feedback from "./pages/Feedback.jsx";
import AdminFeedback from "./pages/admin/AdminFeedback.jsx";
import Notifications from "./pages/Notifications.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";

function AppContent() {
  const location = useLocation();

  // Hide the dashboard navbar and .main-content constraint on public/auth pages
  const isPublicPage = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
  ].includes(location.pathname) || location.pathname.startsWith("/reset-password");

  return (
    <>
      <ServerStatusBanner />

      {/* Only show dashboard navbar on internal dashboard pages */}
      {!isPublicPage && <Navbar />}

      {/* Full width for Landing, Login & Register; Dashboard pages keep .main-content */}
      <main className={isPublicPage ? "landing-wrapper" : "main-content"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* General Routes */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={["admin", "exhibitor", "attendee"]}>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={["admin", "exhibitor", "attendee"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["admin", "exhibitor", "attendee"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expos"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminExpos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expos/:id/booths"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBooths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expos/:id/sessions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Exhibitor Routes */}
          <Route
            path="/exhibitor"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <ExhibitorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exhibitor/profile"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <ExhibitorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exhibitor/expos"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <ExhibitorExpos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exhibitor/applications"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exhibitor/booths"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <ExhibitorBooths />
              </ProtectedRoute>
            }
          />

          {/* Attendee Routes */}
          <Route
            path="/attendee"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <AttendeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee/expos"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <AttendeeExpos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee/expos/:id"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <ExpoDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee/exhibitors/:id"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <ExhibitorProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee/schedule"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <MySchedule />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;