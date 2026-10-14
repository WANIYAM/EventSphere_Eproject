import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useSocket } from "../../../context/SocketContext.jsx";
import api from "../../../services/api.js";

const RetroTvLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [channel, setChannel] = useState<"noise" | "bars" | "wave">("noise");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let step = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (channel === "noise") {
        const idata = ctx.createImageData(w, h);
        const buf = new Uint32Array(idata.data.buffer);
        for (let i = 0; i < buf.length; i++) {
          const val = Math.floor(Math.random() * 255);
          buf[i] = (255 << 24) | (val << 16) | (val << 8) | val;
        }
        ctx.putImageData(idata, 0, 0);
      } else if (channel === "bars") {
        const colors = ["#ff3e33", "#abf139", "#14a6ea", "#feb804", "#a67eff"];
        const barW = w / colors.length;
        colors.forEach((c, idx) => {
          ctx.fillStyle = c;
          ctx.fillRect(idx * barW, 0, barW, h);
        });
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#abf139";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        step += 0.15;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.4 + step) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [channel]);

  const toggleChannel = () => {
    const list: ("noise" | "bars" | "wave")[] = ["noise", "bars", "wave"];
    const next = list[(list.indexOf(channel) + 1) % list.length];
    setChannel(next);
  };

  return (
    <motion.button
      onClick={toggleChannel}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      title="Switch TV channel"
      style={{
        width: 36,
        height: 34,
        borderRadius: 8,
        backgroundColor: "var(--color-cerulean, #14a6ea)",
        border: "1.5px solid var(--color-dark, #231e25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
        position: "relative",
        flexShrink: 0,
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div style={{ position: "absolute", top: -6, left: 10, width: 1.5, height: 7, backgroundColor: "var(--color-dark, #231e25)", transform: "rotate(-25deg)" }} />
      <div style={{ position: "absolute", top: -6, right: 10, width: 1.5, height: 7, backgroundColor: "var(--color-dark, #231e25)", transform: "rotate(25deg)" }} />
      <canvas ref={canvasRef} width={22} height={16} style={{ borderRadius: 2, backgroundColor: "#000", border: "1px solid var(--color-dark, #231e25)" }} />
    </motion.button>
  );
};

const NavButton: React.FC<{
  name: string;
  href: string;
  bg: string;
  textColor: string;
  badge?: number;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ name, href, bg, textColor, badge, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.96 }}
      animate={{
        x: isHovered ? -5 : 0,
        boxShadow: isHovered
          ? "4px 4px 0px var(--color-dark, #231e25)"
          : "2.5px 2.5px 0px var(--color-dark, #231e25)",
      }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "6px 16px",
        borderRadius: 9999,
        backgroundColor: isActive ? "var(--color-dark, #231e25)" : bg,
        color: isActive ? "var(--color-light, #fff8eb)" : textColor,
        textDecoration: "none",
        border: "1.5px solid var(--color-dark, #231e25)",
        fontFamily: "'Satoshi', sans-serif",
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.01em",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span>{name}</span>

      {badge !== undefined && badge > 0 && (
        <span
          style={{
            backgroundColor: "var(--color-primary, #ff3e33)",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 900,
            borderRadius: 10,
            padding: "1px 5px",
            border: "1px solid #000",
          }}
        >
          {badge}
        </span>
      )}

      {isActive && (
        <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)" }} />
      )}
    </motion.a>
  );
};

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const socketContext = useSocket() as {
    socket?: {
      on: (event: string, listener: () => void) => void;
      off: (event: string, listener: () => void) => void;
    };
  } | null;
  const socket = socketContext?.socket ?? null;

  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [80, 260], [0, -100]);
  const navOpacity = useTransform(scrollY, [80, 220], [1, 0]);
  const pointerEvents = useTransform(navOpacity, (val) => (val > 0.05 ? "auto" : "none"));

  useEffect(() => {
    if (user) {
      api.get("/messages/unread-count")
        .then((res) => setUnreadCount(res.data?.count || 0))
        .catch(() => {});
    } else {
      setUnreadCount(0);
    }
  }, [user, location.pathname]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => setUnreadCount((prev) => prev + 1);
    socket.on("message:new", handleNewMessage);
    return () => socket.off("message:new", handleNewMessage);
  }, [socket]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const getNavItems = () => {
    if (!user) {
      return [
        { id: "login", name: "Login", bg: "var(--color-primary, #ff3e33)", textColor: "#ffffff", href: "/login", isRoute: true },
        { id: "register", name: "Register Pass", bg: "var(--color-kiwi, #abf139)", textColor: "#000000", href: "/register", isRoute: true },
        { id: "expos", name: "Expos", bg: "var(--color-selective-yellow, #feb804)", textColor: "var(--color-dark, #231e25)", href: "/expos", isRoute: true },
        { id: "exhibitors", name: "Exhibitors", bg: "var(--color-purple-mimosa, #a67eff)", textColor: "#ffffff", href: "/exhibitors", isRoute: true },
        { id: "about", name: "About", bg: "var(--color-light, #fff8eb)", textColor: "var(--color-dark, #231e25)", href: "#about", isRoute: false },
        { id: "contact", name: "Contact", bg: "var(--color-light-salmon, #ffa490)", textColor: "var(--color-dark, #231e25)", href: "/contact", isRoute: true },
      ];
    }

    if (user.role === "attendee") {
      return [
        { id: "schedule", name: "My Schedule", bg: "var(--color-kiwi, #abf139)", textColor: "#000000", href: "/schedule", isRoute: true },
        { id: "messages", name: "Messages", bg: "var(--color-cerulean, #14a6ea)", textColor: "#ffffff", href: "/messages", isRoute: true, badge: unreadCount },
        { id: "expos", name: "Expos", bg: "var(--color-selective-yellow, #feb804)", textColor: "var(--color-dark, #231e25)", href: "/expos", isRoute: true },
        { id: "exhibitors", name: "Exhibitors", bg: "var(--color-purple-mimosa, #a67eff)", textColor: "#ffffff", href: "/exhibitors", isRoute: true },
        { id: "feedback", name: "Feedback", bg: "var(--color-light-salmon, #ffa490)", textColor: "var(--color-dark, #231e25)", href: "/feedback", isRoute: true },
      ];
    }

    if (user.role === "admin") {
      return [
        { id: "dashboard", name: "Admin Dashboard", bg: "var(--color-primary, #ff3e33)", textColor: "#ffffff", href: "/admin", isRoute: true },
        { id: "messages", name: "Messages", bg: "var(--color-cerulean, #14a6ea)", textColor: "#ffffff", href: "/messages", isRoute: true, badge: unreadCount },
        { id: "expos", name: "Expos", bg: "var(--color-selective-yellow, #feb804)", textColor: "var(--color-dark, #231e25)", href: "/expos", isRoute: true },
        { id: "exhibitors", name: "Exhibitors", bg: "var(--color-purple-mimosa, #a67eff)", textColor: "#ffffff", href: "/exhibitors", isRoute: true },
      ];
    }

    return [
      { id: "dashboard", name: "Exhibitor Portal", bg: "var(--color-purple-mimosa, #a67eff)", textColor: "#ffffff", href: "/exhibitor", isRoute: true },
      { id: "messages", name: "Messages", bg: "var(--color-cerulean, #14a6ea)", textColor: "#ffffff", href: "/messages", isRoute: true, badge: unreadCount },
      { id: "expos", name: "Expos", bg: "var(--color-selective-yellow, #feb804)", textColor: "var(--color-dark, #231e25)", href: "/expos", isRoute: true },
      { id: "exhibitors", name: "Exhibitors", bg: "var(--color-kiwi, #abf139)", textColor: "#000000", href: "/exhibitors", isRoute: true },
    ];
  };

  const navItems = getNavItems();

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    e.preventDefault();
    setMobileOpen(false);

    if (item.isRoute) {
      navigate(item.href);
    } else if (item.href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate(`/${item.href}`);
      } else {
        const targetId = item.href.replace("#", "");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <motion.header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px clamp(14px, 3vw, 28px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        pointerEvents: "none",
        y: navY,
        opacity: navOpacity,
      }}
    >
      <motion.div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents,
          backgroundColor: "rgba(35, 30, 37, 0.72)",
          padding: "4px 12px 4px 4px",
          borderRadius: 24,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1.2px solid rgba(255,255,255,0.25)",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.3)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "inline-flex" }}>
          <RetroTvLogo />
        </Link>
        <div style={{
          display: "flex",
          alignItems: "center",
          color: "#fff",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: "clamp(180px, 24vw, 320px)",
        }}>
          <span style={{ fontSize: 14, marginRight: 6, opacity: 0.9, color: "var(--color-kiwi, #abf139)" }}>[</span>
          <div style={{ overflow: "hidden", display: "inline-flex" }}>
            <div className="marquee-track" style={{ animationDuration: "14s" }}>
              <span style={{ marginRight: 20 }}>EventSphere Management Expo OS</span>
              <span style={{ marginRight: 20 }}>EventSphere Management Expo OS</span>
            </div>
          </div>
          <span style={{ fontSize: 14, marginLeft: 6, opacity: 0.9, color: "var(--color-kiwi, #abf139)" }}>]</span>
        </div>
      </motion.div>

      <motion.nav
        className="desktop-menu-column"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          pointerEvents,
        }}
      >
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            name={item.name}
            href={item.href}
            bg={item.bg}
            textColor={item.textColor}
            badge={item.badge}
            isActive={item.isRoute && location.pathname === item.href}
            onClick={(e) => handleItemClick(e, item)}
          />
        ))}

        {user && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              padding: "4px 12px",
              borderRadius: 9999,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              border: "1.2px solid rgba(255,255,255,0.4)",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Logout ({user.name?.split(" ")[0]})
          </motion.button>
        )}
      </motion.nav>

      <motion.button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-toggle-btn"
        aria-label="Toggle navigation"
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          backgroundColor: mobileOpen ? "var(--color-primary, #ff3e33)" : "var(--color-light, #fff8eb)",
          color: mobileOpen ? "#ffffff" : "var(--color-dark, #231e25)",
          border: "2px solid var(--color-dark, #231e25)",
          boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
          cursor: "pointer",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 13,
          fontWeight: 800,
          pointerEvents,
        }}
      >
        {mobileOpen ? "Close" : "Menu"}
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "fixed",
              top: 70,
              left: 16,
              right: 16,
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              pointerEvents: "auto",
              zIndex: 150,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(e, item)}
                style={{
                  color: "var(--color-dark, #231e25)",
                  textDecoration: "none",
                  padding: "8px 0",
                  fontSize: 16,
                  borderBottom: "1px dashed var(--color-dark, #231e25)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                }}
              >
                <span>{item.name}</span>
                <span>Select</span>
              </a>
            ))}

            {user && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                  navigate("/login");
                }}
                style={{
                  marginTop: 6,
                  padding: "8px",
                  backgroundColor: "var(--color-dark, #231e25)",
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .desktop-menu-column { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
        }
        @media (min-width: 861px) {
          .mobile-toggle-btn { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
};