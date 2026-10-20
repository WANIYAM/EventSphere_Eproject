import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ServerStatusBanner from "./components/ServerStatusBanner.jsx";
import { CustomCursor } from "./components/landing/common/CustomCursor";
import { Navigation } from "./components/landing/navigation/Navigation";
import Navbar from "./components/Navbar.jsx";

// Public Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";
import Expos from "./pages/Expos.jsx";
import ExpoDetails from "./pages/ExpoDetails.jsx";
import Exhibitors from "./pages/Exhibitors.jsx";
import ExhibitorProfile from "./pages/ExhibitorProfile.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// Attendee & Logged-In Pages
import MySchedule from "./pages/attendee/MySchedule.jsx";
import Messages from "./pages/Messages.jsx";
import Feedback from "./pages/Feedback.jsx";
import Notifications from "./pages/Notifications.jsx";

// Admin Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminExpos from "./pages/admin/AdminExpos.jsx";
import AdminBooths from "./pages/admin/AdminBooths.jsx";
import AdminSessions from "./pages/admin/AdminSessions.jsx";
import AdminApplications from "./pages/admin/AdminApplications.jsx";
import AdminFeedback from "./pages/admin/AdminFeedback.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";

// Exhibitor Portal Pages
import ExhibitorDashboard from "./pages/ExhibitorDashboard.jsx";
import ExhibitorProfileManage from "./pages/exhibitor/ExhibitorProfile.jsx";
import ExhibitorExpos from "./pages/exhibitor/ExhibitorExpos.jsx";
import MyApplications from "./pages/exhibitor/MyApplications.jsx";
import ExhibitorBooths from "./pages/exhibitor/ExhibitorBooths.jsx";

const AttendeeExpoRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/expos/${id}`} replace />;
};

const AttendeeExhibitorRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/exhibitors/${id}`} replace />;
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
  ].includes(location.pathname) || location.pathname.startsWith("/reset-password");

  const isPublicPage = [
    "/",
    "/expos",
    "/exhibitors",
    "/about",
    "/contact",
  ].includes(location.pathname) ||
    location.pathname.startsWith("/expos/") ||
    location.pathname.startsWith("/exhibitors/");

  const isWorkspacePage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/exhibitor" ||
    location.pathname.startsWith("/exhibitor/") ||
    location.pathname === "/messages" ||
    location.pathname === "/feedback";

  const showWorkspaceNavbar =
    user &&
    (user.role === "admin" || user.role === "exhibitor") &&
    isWorkspacePage;

  return (
    <>
      <ServerStatusBanner />

      {!isAuthPage && showWorkspaceNavbar && <Navbar />}

      {!isAuthPage && !showWorkspaceNavbar && (
        <>
          <CustomCursor />
          <Navigation />
        </>
      )}

      {/* ✅ Allows auth pages to be full-bleed edge-to-edge */}
      <main
        className={(isPublicPage || isAuthPage) ? "landing-wrapper" : "main-content"}
        style={{
          paddingTop:
            !isPublicPage && !showWorkspaceNavbar && !isAuthPage
              ? 90
              : undefined,
        }}
      >
        <Routes>
          {/* Public & Attendee Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/expos" element={<Expos />} />
          <Route path="/expos/:id" element={<ExpoDetails />} />
          <Route path="/exhibitors" element={<Exhibitors />} />
          <Route path="/exhibitors/:id" element={<ExhibitorProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={["admin", "exhibitor", "attendee"]}>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Attendee Schedule */}
          <Route
            path="/schedule"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <MySchedule />
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

          {/* Legacy Attendee Redirects */}
          <Route path="/attendee" element={<Navigate to="/" replace />} />
          <Route path="/attendee/expos" element={<Navigate to="/expos" replace />} />
          <Route path="/attendee/expos/:id" element={<AttendeeExpoRedirect />} />
          <Route path="/attendee/exhibitors/:id" element={<AttendeeExhibitorRedirect />} />
          <Route path="/attendee/schedule" element={<Navigate to="/schedule" replace />} />

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
                <ExhibitorProfileManage />
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