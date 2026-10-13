import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

// Interactive Retro TV with Channel Switcher
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
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        step += 0.15;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.4 + step) * 6;
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
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      title="Click to switch TV feed"
      style={{
        width: 48,
        height: 46,
        borderRadius: 10,
        backgroundColor: "var(--color-cerulean, #14a6ea)",
        border: "2px solid var(--color-dark, #231e25)",
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
      <div style={{ position: "absolute", top: -8, left: 14, width: 2, height: 9, backgroundColor: "var(--color-dark, #231e25)", transform: "rotate(-25deg)" }} />
      <div style={{ position: "absolute", top: -8, right: 14, width: 2, height: 9, backgroundColor: "var(--color-dark, #231e25)", transform: "rotate(25deg)" }} />
      <canvas ref={canvasRef} width={28} height={22} style={{ borderRadius: 3, backgroundColor: "#000", border: "1px solid var(--color-dark, #231e25)" }} />
    </motion.button>
  );
};

// NavButton Component
const NavButton: React.FC<{
  name: string;
  href: string;
  bg: string;
  textColor: string;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ name, href, bg, textColor, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.96 }}
      animate={{
        x: isHovered ? -8 : 0,
        boxShadow: isHovered
          ? "5px 5px 0px var(--color-dark, #231e25)"
          : "3px 3px 0px var(--color-dark, #231e25)",
      }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "10px 24px",
        borderRadius: 9999,
        backgroundColor: isActive ? "var(--color-dark, #231e25)" : bg,
        color: isActive ? "var(--color-light, #fff8eb)" : textColor,
        textDecoration: "none",
        border: "2px solid var(--color-dark, #231e25)",
        fontFamily: "'Satoshi', sans-serif",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "-0.015em",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ width: 0, opacity: 0, x: -8 }}
            animate={{ width: "auto", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ display: "inline-flex", alignItems: "center", overflow: "hidden" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      <span>{name}</span>

      {isActive && (
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)" }} />
      )}
    </motion.a>
  );
};

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string>("home");

  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [80, 260], [0, -120]);
  const navOpacity = useTransform(scrollY, [80, 220], [1, 0]);
  const pointerEvents = useTransform(navOpacity, (val) => (val > 0.05 ? "auto" : "none"));

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "exhibitor") return "/exhibitor";
    return "/attendee";
  };

  // ONLY 4 NAV ITEMS: Login, About, Expos, Contact
  const navItems = [
    {
      id: "login",
      name: user ? `${user.role.toUpperCase()} PORTAL ↗` : "Login ↗",
      bg: "var(--color-primary, #ff3e33)",
      textColor: "#ffffff",
      href: user ? getDashboardPath() : "/login",
      isRoute: true,
    },
    {
      id: "about",
      name: "About",
      bg: "var(--color-light, #fff8eb)",
      textColor: "var(--color-dark, #231e25)",
      href: "#about",
      isRoute: false,
    },
    {
      id: "expos",
      name: "Expos",
      bg: "var(--color-selective-yellow, #feb804)",
      textColor: "var(--color-dark, #231e25)",
      href: "/expos",
      isRoute: true,
    },
    {
      id: "contact",
      name: "Contact",
      bg: "var(--color-kiwi, #abf139)",
      textColor: "var(--color-dark, #231e25)",
      href: "#footer",
      isRoute: false,
    },
  ];

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

  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const aboutEl = document.getElementById("about");
      const footerEl = document.getElementById("footer");

      if (footerEl && scrollPos >= footerEl.offsetTop) {
        setActiveNavId("contact");
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveNavId("about");
      } else {
        setActiveNavId("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <motion.header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "20px clamp(16px, 3.5vw, 36px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        pointerEvents: "none",
        y: navY,
        opacity: navOpacity,
      }}
    >
      {/* Brand & Retro TV Ticker */}
      <motion.div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          pointerEvents,
          backgroundColor: "rgba(35, 30, 37, 0.7)",
          padding: "6px 16px 6px 6px",
          borderRadius: 34,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
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
          fontSize: 14,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: "clamp(200px, 30vw, 380px)",
        }}>
          <span style={{ fontSize: 18, marginRight: 6, opacity: 0.9, color: "var(--color-kiwi, #abf139)" }}>&#91;</span>
          <div style={{ overflow: "hidden", display: "inline-flex" }}>
            <div className="marquee-track" style={{ animationDuration: "14s" }}>
              <span style={{ marginRight: 24 }}>
                &#123; EventSphere Management &nbsp; Expo & Trade Show Operating System &#125;
              </span>
              <span style={{ marginRight: 24 }}>
                &#123; EventSphere Management &nbsp; Expo & Trade Show Operating System &#125;
              </span>
            </div>
          </div>
          <span style={{ fontSize: 18, marginLeft: 6, opacity: 0.9, color: "var(--color-kiwi, #abf139)" }}>&#93;</span>
        </div>
      </motion.div>

      {/* TOP RIGHT: Nav Pills (Login, About, Expos, Contact) */}
      <motion.nav
        className="desktop-menu-column"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          pointerEvents,
        }}
      >
        {navItems.map((item) => {
          const isRouteActive = item.isRoute && location.pathname === item.href;
          const isAnchorActive = !item.isRoute && location.pathname === "/" && activeNavId === item.id;
          return (
            <NavButton
              key={item.id}
              name={item.name}
              href={item.href}
              bg={item.bg}
              textColor={item.textColor}
              isActive={isRouteActive || isAnchorActive}
              onClick={(e) => handleItemClick(e, item)}
            />
          );
        })}

        {user && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              padding: "6px 18px",
              borderRadius: 9999,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            LOGOUT ✕
          </motion.button>
        )}
      </motion.nav>

      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-toggle-btn"
        aria-label="Toggle navigation"
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: mobileOpen ? "var(--color-primary, #ff3e33)" : "var(--color-light, #fff8eb)",
          border: "2px solid var(--color-dark, #231e25)",
          boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
          cursor: "pointer",
          display: "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          pointerEvents,
        }}
      >
        <span style={{ width: 22, height: 3, backgroundColor: mobileOpen ? "#fff" : "#000", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none", transition: "0.2s" }} />
        <span style={{ width: 22, height: 3, backgroundColor: mobileOpen ? "#fff" : "#000", transform: mobileOpen ? "rotate(-45deg) translate(3px, -3px)" : "none", transition: "0.2s" }} />
      </motion.button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{
              position: "fixed",
              top: 84,
              left: 20,
              right: 20,
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
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
                  color: item.id === "login" ? "var(--color-primary, #ff3e33)" : "var(--color-dark, #231e25)",
                  textDecoration: "none",
                  padding: "10px 0",
                  fontSize: 20,
                  borderBottom: "1.5px dashed var(--color-dark, #231e25)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                }}
              >
                <span>{item.name}</span>
                <span>→</span>
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
                  marginTop: 10,
                  padding: "10px",
                  backgroundColor: "var(--color-dark, #231e25)",
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                LOGOUT
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .desktop-menu-column { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }
      `}</style>
    </motion.header>
  );
};