import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
        backgroundColor: "var(--color-cerulean)",
        border: "2px solid var(--color-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "2px 2px 0px var(--color-dark)",
        position: "relative",
        flexShrink: 0,
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div style={{ position: "absolute", top: -8, left: 14, width: 2, height: 9, backgroundColor: "var(--color-dark)", transform: "rotate(-25deg)" }} />
      <div style={{ position: "absolute", top: -8, right: 14, width: 2, height: 9, backgroundColor: "var(--color-dark)", transform: "rotate(25deg)" }} />
      <canvas ref={canvasRef} width={28} height={22} style={{ borderRadius: 3, backgroundColor: "#000", border: "1px solid var(--color-dark)" }} />
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
        x: isHovered ? -10 : 0,
        boxShadow: isHovered
          ? "5px 5px 0px var(--color-dark)"
          : "3px 3px 0px var(--color-dark)",
      }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "11px 28px",
        borderRadius: 9999,
        backgroundColor: isActive ? "var(--color-dark)" : bg,
        color: isActive ? "var(--color-light)" : textColor,
        textDecoration: "none",
        border: "2px solid var(--color-dark)",
        fontFamily: "'Satoshi', sans-serif",
        fontSize: 20,
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      <span>{name}</span>

      {isActive && (
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-kiwi)" }} />
      )}
    </motion.a>
  );
};

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string>("home");

  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [80, 260], [0, -120]);
  const navOpacity = useTransform(scrollY, [80, 220], [1, 0]);
  const pointerEvents = useTransform(navOpacity, (val) => (val > 0.05 ? "auto" : "none"));

  // Navigation Items
  const navItems = [
    { id: "login", name: "Login ↗", bg: "var(--color-primary)", textColor: "#ffffff", href: "/login", isRoute: true },
    { id: "about", name: "About us", bg: "var(--color-light)", textColor: "var(--color-dark)", href: "#about" },
    { id: "agenda", name: "Agenda", bg: "var(--color-light)", textColor: "var(--color-dark)", href: "#agenda" },
    { id: "gallery", name: "Gallery", bg: "var(--color-light-salmon)", textColor: "var(--color-light)", href: "#gallery" },
    { id: "recordings", name: "Recordings", bg: "var(--color-vista-blue)", textColor: "var(--color-light)", href: "#recordings" },
    { id: "footer", name: "Contact", bg: "var(--color-selective-yellow)", textColor: "var(--color-dark)", href: "#footer" },
  ];

  // Click Handler for both Anchor Scrolls and Page Routes
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    e.preventDefault();
    if (item.isRoute) {
      navigate(item.href);
      setMobileOpen(false);
    } else if (item.href.startsWith("#")) {
      const targetId = item.href.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
      setMobileOpen(false);
    }
  };

  // Synchronized scroll-spy tracking DOM order
  useEffect(() => {
    const handleScroll = () => {
      const sectionOrder = [
        { domId: "hero", navId: "home" },
        { domId: "gallery", navId: "gallery" },
        { domId: "about", navId: "about" },
        { domId: "speakers", navId: "about" },
        { domId: "agenda", navId: "agenda" },
        { domId: "sponsors", navId: "gallery" },
        { domId: "testimonials", navId: "about" },
        { domId: "tickets", navId: "agenda" },
        { domId: "recordings", navId: "recordings" },
        { domId: "faq", navId: "about" },
        { domId: "footer", navId: "footer" },
      ];

      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (let i = sectionOrder.length - 1; i >= 0; i--) {
        const item = sectionOrder[i];
        const el = document.getElementById(item.domId);
        if (el && scrollPos >= el.offsetTop) {
          setActiveNavId(item.navId);
          return;
        }
      }

      setActiveNavId("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "24px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        pointerEvents: "none",
        y: navY,
        opacity: navOpacity,
      }}
    >
      {/* TOP LEFT: Retro TV & Bracket Ticker */}
      <motion.div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          pointerEvents,
          backgroundColor: "rgba(35, 30, 37, 0.55)",
          padding: "6px 16px 6px 6px",
          borderRadius: 34,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
        }}
      >
        <RetroTvLogo />
        <div style={{
          display: "flex",
          alignItems: "center",
          color: "#fff",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: "clamp(220px, 32vw, 400px)",
        }}>
          <span style={{ fontSize: 20, marginRight: 8, opacity: 0.9, color: "var(--color-kiwi)" }}>&#91;</span>
          <div style={{ overflow: "hidden", display: "inline-flex" }}>
            <div className="marquee-track" style={{ animationDuration: "14s" }}>
              <span style={{ marginRight: 24 }}>
                &#123; EventSphere Management &nbsp; Modern Expo & Trade Show Operating System &#125;
              </span>
              <span style={{ marginRight: 24 }}>
                &#123; EventSphere Management &nbsp; Modern Expo & Trade Show Operating System &#125;
              </span>
            </div>
          </div>
          <span style={{ fontSize: 20, marginLeft: 8, opacity: 0.9, color: "var(--color-kiwi)" }}>&#93;</span>
        </div>
      </motion.div>

      {/* TOP RIGHT: Vertical Navigation Pills (Includes Login at Top) */}
      <motion.nav
        className="desktop-menu-column"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
          pointerEvents,
        }}
      >
        {navItems.map((item) => (
          <NavButton
            key={item.name}
            name={item.name}
            href={item.href}
            bg={item.bg}
            textColor={item.textColor}
            isActive={!item.isRoute && activeNavId === item.id}
            onClick={(e) => handleItemClick(e, item)}
          />
        ))}
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
          backgroundColor: mobileOpen ? "var(--color-primary)" : "var(--color-light)",
          border: "2px solid var(--color-dark)",
          boxShadow: "3px 3px 0px var(--color-dark)",
          cursor: "pointer",
          display: "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          pointerEvents,
        }}
      >
        <span style={{ width: 24, height: 3, backgroundColor: mobileOpen ? "#fff" : "#000", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none", transition: "0.2s" }} />
        <span style={{ width: 24, height: 3, backgroundColor: mobileOpen ? "#fff" : "#000", transform: mobileOpen ? "rotate(-45deg) translate(3px, -3px)" : "none", transition: "0.2s" }} />
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
              top: 88,
              left: 20,
              right: 20,
              backgroundColor: "var(--color-light)",
              border: "3px solid var(--color-dark)",
              boxShadow: "6px 6px 0px var(--color-dark)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              pointerEvents: "auto",
              zIndex: 150,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleItemClick(e, item)}
                className="style-p2"
                style={{
                  color: item.isRoute ? "var(--color-primary)" : "var(--color-dark)",
                  textDecoration: "none",
                  padding: "10px 0",
                  fontSize: 22,
                  borderBottom: "1.5px dashed var(--color-dark)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <span>{item.name}</span>
                <span>→</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 810px) {
          .desktop-menu-column { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }
      `}</style>
    </motion.header>
  );
};