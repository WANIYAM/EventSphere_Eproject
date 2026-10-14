import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token, loading, serverUnavailable, retryAuth } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading application state...</p>
      </div>
    );
  }

  // Handle transient server/database downtime without logging the user out
  if (serverUnavailable && token) {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", padding: 32, backgroundColor: "#ffffff", border: "2px solid #231e25", textAlign: "center", fontFamily: "'Satoshi', sans-serif" }}>
        <h3 style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: 28, margin: "0 0 10px 0" }}>
          SERVICE TEMPORARILY UNAVAILABLE
        </h3>
        <p style={{ color: "#4b5563", fontSize: 14, margin: "0 0 20px 0" }}>
          The database is currently reconnecting. Your session is preserved.
        </p>
        <button
          onClick={retryAuth}
          style={{
            backgroundColor: "#231e25",
            color: "#ffffff",
            border: "none",
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Send unauthenticated users to login while preserving their destination
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;