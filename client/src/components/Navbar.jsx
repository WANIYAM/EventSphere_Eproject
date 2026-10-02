import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

  // Update unread count on live message event
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
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

  return (
    <nav className="navbar">
      <div className="nav-brand flex-between w-full-mobile">
        <Link to="/" onClick={() => setMobileOpen(false)}>EventSphere</Link>
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
        {user ? (
          <>
            <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link to="/messages" className="nav-messages-link" onClick={() => setMobileOpen(false)}>
              Messages
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </Link>
            <Link to="/feedback" onClick={() => setMobileOpen(false)}>Feedback</Link>
            <NotificationBell />
            <span className="user-welcome">Welcome, {user.name} ({user.role})</span>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="btn-logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
