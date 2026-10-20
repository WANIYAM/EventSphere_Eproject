import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
        const res = await api.get("/messages/unread-count");
        setUnreadCount(res.data?.count || 0);
      } catch {
        // silent fallback
      }
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => { fetchUnread(); }, [user, location.pathname]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => setUnreadCount((prev) => prev + 1);
    socket.on("message:new", handleNewMessage);
    return () => socket.off("message:new", handleNewMessage);
  }, [socket]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadgeColor = () => {
    if (!user) return "#231e25";
    switch (user.role) {
      case "admin": return "var(--color-primary, #ff3e33)";
      case "exhibitor": return "var(--color-purple-mimosa, #a67eff)";
      case "attendee":
      default: return "var(--color-kiwi, #abf139)";
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const isOnMessages = location.pathname === "/messages";

  /* ── Link styles ────────────────────────────────────────────── */
  const linkStyle = {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
    color: "#231e25",
    padding: "6px 12px",
    borderRadius: 30,
    border: "1.5px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
    flexShrink: 0,
  };

  const activeLinkStyle = (path) => {
    const isActive =
      location.pathname === path ||
      (path !== "/admin" && path !== "/exhibitor" && location.pathname.startsWith(`${path}/`));

    return {
      ...linkStyle,
      color: isActive ? "#ffffff" : "#231e25",
      fontWeight: 900,
      backgroundColor: isActive ? "#231e25" : "transparent",
      border: isActive ? "1.5px solid #000" : "1.5px solid transparent",
      boxShadow: isActive ? "2px 2px 0 var(--color-primary, #ff3e33)" : "none",
    };
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "3px solid #231e25",
        boxShadow: "0 4px 0 rgba(35, 30, 37, 0.08)",
        padding: "10px clamp(14px, 2.5vw, 28px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "nowrap",
      }}
    >
      {/* ═══════════ BRAND ═══════════ */}
      <Link
        to={user?.role === "admin" ? "/admin" : user?.role === "exhibitor" ? "/exhibitor" : "/"}
        onClick={() => setMobileOpen(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "#231e25",
          flexShrink: 0,
        }}
      >
        <motion.div
          whileHover={{ rotate: -6, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          style={{
            width: 34,
            height: 32,
            borderRadius: 8,
            backgroundColor: "var(--color-cerulean, #14a6ea)",
            border: "2px solid #231e25",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "3px 3px 0 #231e25",
            position: "relative",
          }}
        >
          <div style={{ width: 15, height: 10, backgroundColor: "#000", borderRadius: 2 }} />
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              position: "absolute",
              bottom: 3,
              right: 4,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "var(--color-primary, #ff3e33)",
              border: "1px solid #000",
            }}
          />
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: 1,
            }}
          >
            EVENTSPHERE
          </span>
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 8.5,
              fontWeight: 800,
              letterSpacing: 1.2,
              color: "#6b7280",
              marginTop: 1,
            }}
          >
            EXPO MANAGEMENT
          </span>
        </div>
      </Link>

      {/* ═══════════ MOBILE TOGGLE ═══════════ */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        className="mobile-menu-button"
        style={{
          border: "2px solid #231e25",
          background: mobileOpen ? "#231e25" : "#fff8eb",
          color: mobileOpen ? "#fff8eb" : "#231e25",
          padding: "6px 14px",
          borderRadius: 30,
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: 0.4,
          cursor: "pointer",
          boxShadow: mobileOpen ? "1.5px 1.5px 0 #000" : "3px 3px 0 #000",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: mobileOpen ? "var(--color-kiwi, #abf139)" : "var(--color-primary, #ff3e33)",
            border: "1.5px solid #000",
          }}
        />
        {mobileOpen ? "CLOSE" : "MENU"}
      </button>

      {/* ═══════════ NAV LINKS + UTILITIES ═══════════ */}
      {/* ✅ Fixed: overflow is now "visible" so dropdown cards can expand downwards freely */}
      <div
        className={`nav-links ${mobileOpen ? "open" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flex: 1,
          minWidth: 0,
          justifyContent: "flex-end",
          flexWrap: "nowrap",
          overflow: "visible",
          position: "relative",
        }}
      >
        {/* ── Admin links ── */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/admin")}>Overview</Link>
            <Link to="/admin/expos" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/admin/expos")}>Manage Expos</Link>
            <Link to="/admin/applications" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/admin/applications")}>Approvals</Link>
            <Link to="/admin/analytics" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/admin/analytics")}>Analytics</Link>
            <Link to="/admin/feedback" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/admin/feedback")}>Reviews</Link>

            <Link
              to="/expos"
              onClick={() => setMobileOpen(false)}
              style={{
                ...linkStyle,
                backgroundColor: "var(--color-kiwi, #abf139)",
                border: "1.5px solid #000",
                boxShadow: "2px 2px 0 #000",
                fontWeight: 900,
              }}
            >
              Public Site ↗
            </Link>
          </>
        )}

        {/* ── Exhibitor links ── */}
        {user?.role === "exhibitor" && (
          <>
            <Link to="/exhibitor" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/exhibitor")}>Dashboard</Link>
            <Link to="/exhibitor/profile" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/exhibitor/profile")}>My Profile</Link>
            <Link to="/exhibitor/expos" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/exhibitor/expos")}>Browse Expos</Link>
            <Link to="/exhibitor/applications" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/exhibitor/applications")}>Applications</Link>
            <Link to="/exhibitor/booths" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/exhibitor/booths")}>My Booth</Link>
            <Link to="/feedback" onClick={() => setMobileOpen(false)} style={activeLinkStyle("/feedback")}>Support</Link>

            <Link
              to="/expos"
              onClick={() => setMobileOpen(false)}
              style={{
                ...linkStyle,
                backgroundColor: "var(--color-kiwi, #abf139)",
                border: "1.5px solid #000",
                boxShadow: "2px 2px 0 #000",
                fontWeight: 900,
              }}
            >
              Public Site ↗
            </Link>
          </>
        )}

        {/* ── Utility cluster (auth users) ── */}
        {user && (
          <div
            className="nav-utility-cluster"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
              paddingLeft: 8,
              marginLeft: 0,
              borderLeft: "2px dashed rgba(35,30,37,0.2)",
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* ── Messages — icon pill with badge ── */}
            <Link
              to="/messages"
              onClick={() => setMobileOpen(false)}
              title={`Messages${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
              aria-label={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                padding: 0,
                borderRadius: "50%",
                backgroundColor: isOnMessages ? "#231e25" : "#ffffff",
                color: isOnMessages ? "#fff8eb" : "#231e25",
                border: "2px solid #231e25",
                boxShadow: isOnMessages ? "1.5px 1.5px 0 #000" : "3px 3px 0 #000",
                textDecoration: "none",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-8.4 8.4 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.9a8.5 8.5 0 0 1-.8-3.6A8.4 8.4 0 0 1 12.5 3h.2a8.4 8.4 0 0 1 8.3 8.4Z" />
              </svg>

              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 22 }}
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 21,
                    height: 21,
                    padding: "0 5px",
                    borderRadius: 21,
                    backgroundColor: "var(--color-primary, #ff3e33)",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 900,
                    fontFamily: "'Satoshi', sans-serif",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #000",
                    boxShadow: "1.5px 1.5px 0 #000",
                    letterSpacing: 0.2,
                    lineHeight: 1,
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </Link>

            {/* ── Notification Bell (icon pill w/ badge) ── */}
            <NotificationBell />

            {/* ── User pill ── */}
            <div
              title={`${user.name} · ${user.role}${user.company ? ` · ${user.company}` : ""}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#f3f4f6",
                border: "2px solid #231e25",
                boxShadow: "2px 2px 0 #000",
                padding: "3px 10px 3px 3px",
                borderRadius: 30,
                flexShrink: 0,
                height: 42,
              }}
            >
              <span
                style={{
                  backgroundColor: getRoleBadgeColor(),
                  color: user.role === "attendee" ? "#000" : "#fff",
                  fontSize: 9.5,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  padding: "3px 7px",
                  borderRadius: 20,
                  border: "1.5px solid #000",
                }}
              >
                {user.role}
              </span>
              <span
                className="nav-label"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#231e25",
                  whiteSpace: "nowrap",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {firstName}
              </span>
            </div>

            {/* ── Logout ── */}
            <motion.button
              whileHover={{ y: -2, boxShadow: "5px 5px 0 #000" }}
              whileTap={{ y: 1, boxShadow: "1.5px 1.5px 0 #000" }}
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              title={`Logout${user?.name ? ` · ${user.name}` : ""}`}
              aria-label="Logout"
              style={{
                backgroundColor: "#fff8eb",
                color: "#231e25",
                border: "2px solid #231e25",
                boxShadow: "3px 3px 0 #000",
                padding: "6px 14px",
                borderRadius: 30,
                fontFamily: "var(--font-display)",
                fontSize: 13,
                letterSpacing: 0.8,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                flexShrink: 0,
                height: 42,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="nav-label">LOGOUT</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* ═══════════ Responsive styles ═══════════ */}
      <style>{`
        @media (min-width: 1101px) {
          .mobile-menu-button { display: none !important; }
        }

        @media (max-width: 1100px) {
          .navbar { flex-wrap: wrap !important; }
          .mobile-menu-button { display: inline-flex !important; }
          .nav-links {
            display: none;
            width: 100%;
            flex-direction: column;
            align-items: stretch !important;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 2px dashed #000;
            gap: 8px !important;
            overflow: visible !important;
            justify-content: flex-start !important;
          }
          .nav-links.open { display: flex !important; }
          .nav-links > a { justify-content: flex-start !important; width: 100%; }
          .nav-utility-cluster {
            width: 100%;
            flex-direction: column;
            align-items: stretch !important;
            padding-left: 0 !important;
            margin-left: 0 !important;
            border-left: none !important;
            padding-top: 12px;
            border-top: 2px dashed rgba(35,30,37,0.2);
          }
          .nav-utility-cluster > * { width: 100%; justify-content: flex-start !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;