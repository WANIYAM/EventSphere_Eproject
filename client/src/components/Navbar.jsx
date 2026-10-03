import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import api from "../services/api.js";
import NotificationBell from "./NotificationBell.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchUnread = async () => {
    if (user) {
      try {
        const res = await api.get("/api/messages/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnread();
  }, [user, location.pathname]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => setUnreadCount((prev) => prev + 1);
    socket.on("message:new", handleNewMessage);
    return () => socket.off("message:new", handleNewMessage);
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "exhibitor":
        return "/exhibitor";
      case "attendee":
      default:
        return "/attendee";
    }
  };

  const getRoleBadgeColor = () => {
    if (!user) return "var(--color-dark, #231e25)";
    switch (user.role) {
      case "admin":
        return "var(--color-primary, #ff3e33)";
      case "exhibitor":
        return "var(--color-purple-mimosa, #a67eff)";
      case "attendee":
      default:
        return "var(--color-kiwi, #abf139)";
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "2.5px solid var(--color-dark, #231e25)",
        boxShadow: "0 3px 0px rgba(35, 30, 37, 0.08)",
        padding: "12px clamp(16px, 3vw, 36px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand & Mini TV Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--color-dark, #231e25)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 30,
              borderRadius: 6,
              backgroundColor: "var(--color-cerulean, #14a6ea)",
              border: "1.5px solid var(--color-dark, #231e25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "1.5px 1.5px 0px var(--color-dark, #231e25)",
            }}
          >
            <div style={{ width: 14, height: 10, backgroundColor: "#000", borderRadius: 2 }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
              fontSize: 26,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            EVENTSPHERE
          </span>
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        className="hamburger-btn"
        style={{
          background: "none",
          border: "2px solid var(--color-dark, #231e25)",
          padding: "4px 8px",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 18,
          fontWeight: 900,
        }}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Desktop & Mobile Navigation Links */}
      <div
        className={`nav-links ${mobileOpen ? "open" : ""}`}
        style={{ display: "flex", alignItems: "center", gap: 14 }}
      >
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            color: "var(--color-dark, #231e25)",
            padding: "6px 12px",
          }}
        >
          Landing Page
        </Link>

        {user ? (
          <>
            {/* Dashboard Link */}
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                color: "var(--color-dark, #231e25)",
                padding: "6px 12px",
                borderRadius: 20,
                backgroundColor: "var(--color-light, #fff8eb)",
                border: "1.5px solid var(--color-dark, #231e25)",
              }}
            >
              Dashboard
            </Link>

            {/* Messages with Live Unread Pill */}
            <Link
              to="/messages"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                color: "var(--color-dark, #231e25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
              }}
            >
              <span>Messages</span>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    backgroundColor: "var(--color-primary, #ff3e33)",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 800,
                    borderRadius: 20,
                    padding: "2px 7px",
                    border: "1px solid var(--color-dark, #231e25)",
                  }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </Link>

            {/* Feedback */}
            <Link
              to="/feedback"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                color: "var(--color-dark, #231e25)",
                padding: "6px 12px",
              }}
            >
              Feedback
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Profile Pill Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#f3f4f6",
                border: "1.5px solid var(--color-dark, #231e25)",
                padding: "4px 10px 4px 6px",
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  backgroundColor: getRoleBadgeColor(),
                  color: user.role === "attendee" ? "#000" : "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: 12,
                  letterSpacing: 0.5,
                }}
              >
                {user.role}
              </span>
              <span
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-dark, #231e25)",
                }}
              >
                {user.name}
              </span>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ y: -1, boxShadow: "2px 2px 0px var(--color-dark, #231e25)" }}
              whileTap={{ y: 1 }}
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              style={{
                backgroundColor: "var(--color-light, #fff8eb)",
                color: "var(--color-dark, #231e25)",
                border: "1.5px solid var(--color-dark, #231e25)",
                padding: "6px 14px",
                borderRadius: 6,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Logout ↗
            </motion.button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                color: "var(--color-dark, #231e25)",
                padding: "6px 14px",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                backgroundColor: "var(--color-primary, #ff3e33)",
                color: "#ffffff",
                border: "1.5px solid var(--color-dark, #231e25)",
                boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
                padding: "6px 16px",
                borderRadius: 20,
              }}
            >
              Register Pass
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;