import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "exhibitor") return "/exhibitor";
    return "/attendee";
  };

  const handleAnchorClick = (e, hash) => {
    if (location.pathname !== "/") {
      navigate(`/${hash}`);
    } else {
      e.preventDefault();
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
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
      {/* Brand */}
      <Link
        to="/"
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

      {/* 4 NAV LINKS: Login, About, Expos, Contact */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* 1. Login / Portal */}
        {user ? (
          <Link
            to={getDashboardPath()}
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              textDecoration: "none",
              color: "#ffffff",
              backgroundColor: "var(--color-primary, #ff3e33)",
              border: "1.5px solid var(--color-dark, #231e25)",
              boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
              padding: "6px 14px",
              borderRadius: 20,
            }}
          >
            {user.role.toUpperCase()} PORTAL ↗
          </Link>
        ) : (
          <Link
            to="/login"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              textDecoration: "none",
              color: "#ffffff",
              backgroundColor: "var(--color-primary, #ff3e33)",
              border: "1.5px solid var(--color-dark, #231e25)",
              boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
              padding: "6px 14px",
              borderRadius: 20,
            }}
          >
            LOGIN ↗
          </Link>
        )}

        {/* 2. About */}
        <a
          href="#about"
          onClick={(e) => handleAnchorClick(e, "#about")}
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            color: "var(--color-dark, #231e25)",
            padding: "6px 10px",
          }}
        >
          About
        </a>

        {/* 3. Expos */}
        <Link
          to="/expos"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            color: location.pathname === "/expos" ? "#ffffff" : "var(--color-dark, #231e25)",
            backgroundColor: location.pathname === "/expos" ? "var(--color-dark, #231e25)" : "transparent",
            borderRadius: 20,
            padding: "6px 12px",
          }}
        >
          Expos
        </Link>

        {/* 4. Contact */}
        <a
          href="#footer"
          onClick={(e) => handleAnchorClick(e, "#footer")}
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            color: "var(--color-dark, #231e25)",
            padding: "6px 10px",
          }}
        >
          Contact
        </a>

        {/* Logout button (only if logged in) */}
        {user && (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={handleLogout}
            style={{
              backgroundColor: "var(--color-light, #fff8eb)",
              color: "var(--color-dark, #231e25)",
              border: "1.5px solid var(--color-dark, #231e25)",
              padding: "5px 12px",
              borderRadius: 6,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Logout
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;