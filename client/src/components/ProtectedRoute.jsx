import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

/* Mini kit (kept inline to keep this file standalone) */
const CornerBrackets = ({ color = "#000", inset = 8, size = 11, thickness = 2.5 }) => (
  <>
    <div style={{ position: "absolute", top: inset, left: inset, width: size, height: size, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: inset, right: inset, width: size, height: size, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: inset, left: inset, width: size, height: size, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: inset, right: inset, width: size, height: size, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
  </>
);

const PulseDot = ({ color = "#abf139", size = 8 }) => (
  <motion.span
    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      backgroundColor: color, border: "1.5px solid #000",
      boxShadow: `0 0 8px ${color}`,
    }}
  />
);

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token, loading, serverUnavailable, retryAuth } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light, #fff8eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid #231e25",
            boxShadow: "8px 8px 0 #231e25",
            padding: "48px 42px",
            maxWidth: 420,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            textAlign: "center",
          }}
        >
          <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 54, height: 54, borderRadius: "50%",
              border: "4px solid #231e25",
              borderTopColor: "var(--color-primary, #ff3e33)",
            }}
          />

          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            letterSpacing: 1,
            color: "#231e25",
            margin: 0,
            lineHeight: 1,
          }}>
            LOADING ACCESS…
          </h3>

          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 13,
            color: "#6b7280",
            margin: 0,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}>
            <PulseDot color="var(--color-primary, #ff3e33)" size={7} />
            Verifying your session
          </p>
        </motion.div>
      </div>
    );
  }

  if (serverUnavailable && token) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light, #fff8eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          whileHover={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{
            backgroundColor: "var(--color-selective-yellow, #feb804)",
            border: "3px solid #231e25",
            boxShadow: "10px 10px 0 #231e25",
            padding: "42px 36px",
            maxWidth: 520,
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CornerBrackets color="#000" inset={10} size={13} thickness={3} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#000", color: "#fff",
            padding: "4px 12px", borderRadius: 4,
            fontSize: 11, fontWeight: 800, letterSpacing: 1,
            border: "1.5px solid #000",
            boxShadow: "2px 2px 0 #000",
            fontFamily: "'Satoshi', sans-serif",
            marginBottom: 16,
          }}>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block", fontSize: 12 }}
            >
              ⟳
            </motion.span>
            SERVICE RECONNECTING
          </div>

          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 38px)",
            margin: "0 0 12px 0",
            lineHeight: 0.95,
            letterSpacing: 1,
            color: "#231e25",
          }}>
            TEMPORARILY UNAVAILABLE
          </h3>

          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            color: "#1f2937",
            fontSize: 14,
            margin: "0 0 24px 0",
            lineHeight: 1.55,
            fontWeight: 600,
          }}>
            The database is currently reconnecting. Your session is preserved — no need to log in again.
          </p>

          <motion.button
            onClick={retryAuth}
            whileHover={{ y: -3, boxShadow: "6px 6px 0 #000" }}
            whileTap={{ y: 1, boxShadow: "2px 2px 0 #000" }}
            style={{
              position: "relative", overflow: "hidden",
              backgroundColor: "#231e25",
              color: "#fff",
              border: "2.5px solid #000",
              boxShadow: "4px 4px 0 #000",
              padding: "12px 28px",
              fontFamily: "var(--font-display)",
              fontSize: 20,
              letterSpacing: 1,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <PulseDot color="var(--color-kiwi, #abf139)" size={8} />
            RETRY CONNECTION
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;