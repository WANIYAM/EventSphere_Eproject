import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useSocket } from "../../../context/SocketContext.jsx";
import api from "../../../services/api.js";
import NotificationBell from "../../../components/NotificationBell.jsx";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const INK = "var(--color-dark, #231e25)";
const CREAM = "var(--color-light, #fff8eb)";
const PRIMARY = "var(--color-primary, #ff3e33)";
const KIWI = "var(--color-kiwi, #abf139)";

type NavItem = {
  id: string;
  name: string;
  bg: string;
  textColor: string;
  href: string;
  isRoute?: boolean;
  badge?: number;
};

/* ------------------------------------------------------------------ */
/*  Compact Interactive Retro TV with Channel Switcher                 */
/* ------------------------------------------------------------------ */
const RetroTvLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [channel, setChannel] = useState<"noise" | "bars" | "wave">("noise");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let step = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (channel === "noise") {
        const idata = ctx.createImageData(w, h);
        const buf = new Uint32Array(idata.data.buffer);
        for (let i = 0; i < buf.length; i++) {
          const val = (Math.random() * 255) | 0;
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
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(0, h - 3, w, 3);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = KIWI;
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

  const CHANNELS: ("noise" | "bars" | "wave")[] = ["noise", "bars", "wave"];

  return (
    <motion.button
      type="button"
      onClick={() =>
        setChannel(CHANNELS[(CHANNELS.indexOf(channel) + 1) % CHANNELS.length])
      }
      whileHover={{ scale: 1.08, rotate: -2 }}
      whileTap={{ scale: 0.92, rotate: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 22 }}
      title={`Channel: ${channel} — click to switch`}
      aria-label="Switch TV channel"
      style={{
        width: 42,
        height: 40,
        borderRadius: 10,
        backgroundColor: "var(--color-cerulean, #14a6ea)",
        border: `2px solid ${INK}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `2px 2px 0px ${INK}`,
        position: "relative",
        flexShrink: 0,
        cursor: "pointer",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -7,
          left: 10,
          width: 2,
          height: 8,
          backgroundColor: INK,
          borderRadius: 2,
          transform: "rotate(-28deg)",
          transformOrigin: "bottom center",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: -7,
          right: 10,
          width: 2,
          height: 8,
          backgroundColor: INK,
          borderRadius: 2,
          transform: "rotate(28deg)",
          transformOrigin: "bottom center",
        }}
      />

      <canvas
        ref={canvasRef}
        width={26}
        height={19}
        style={{
          borderRadius: 3,
          backgroundColor: "#000",
          border: `1.5px solid ${INK}`,
          display: "block",
        }}
      />

      <motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: 5,
          bottom: 4,
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: PRIMARY,
          border: `1px solid ${INK}`,
        }}
      />
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/*  Floating Neobrutalist Pill — ENLARGED                              */
/* ------------------------------------------------------------------ */
const NavButton: React.FC<{
  name: string;
  href: string;
  bg: string;
  textColor: string;
  badge?: number;
  isActive?: boolean;
  index?: number;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ name, href, bg, textColor, badge, isActive, index = 0, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const pressed = !!isActive;
  const lifted = isHovered && !pressed;

  const shadow = pressed
    ? `1.5px 1.5px 0px ${INK}`
    : lifted
    ? `7px 7px 0px ${INK}`
    : `4px 4px 0px ${INK}`;

  return (
    <motion.a
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: 26, scale: 0.92 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: pressed ? 2 : lifted ? -6 : 0,
        y: pressed ? 2 : lifted ? -2 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
        delay: index * 0.045,
      }}
      whileTap={{ scale: 0.96, x: 2, y: 2 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        padding: "11px 26px",
        borderRadius: 9999,
        backgroundColor: pressed ? INK : bg,
        color: pressed ? CREAM : textColor,
        textDecoration: "none",
        border: `2.5px solid ${INK}`,
        boxShadow: shadow,
        fontFamily: "'Satoshi', sans-serif",
        fontSize: 15.5,
        fontWeight: 800,
        letterSpacing: "0.014em",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        position: "relative",
        willChange: "transform",
        minHeight: 44,
      }}
    >
      <span>{name}</span>

      {badge !== undefined && badge > 0 && (
        <motion.span
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundColor: PRIMARY,
            color: "#ffffff",
            fontSize: 11.5,
            fontWeight: 900,
            lineHeight: 1,
            borderRadius: 12,
            padding: "4px 8px",
            border: `1.5px solid ${INK}`,
            boxShadow: `1.5px 1.5px 0px ${INK}`,
          }}
        >
          {badge > 99 ? "99+" : badge}
        </motion.span>
      )}

      {pressed && (
        <motion.span
          layoutId="active-pill-dot"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: KIWI,
            boxShadow: `0 0 0 1.5px ${INK}`,
          }}
        />
      )}
    </motion.a>
  );
};

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { socket } = useSocket() as unknown as {
    socket: {
      on: (event: string, handler: () => void) => void;
      off: (event: string, handler: () => void) => void;
    } | null;
  };

  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [80, 260], [0, -100]);
  const navOpacity = useTransform(scrollY, [80, 220], [1, 0]);
  const pointerEvents = useTransform(navOpacity, (val) =>
    val > 0.05 ? "auto" : "none"
  );

  useEffect(() => {
    if (user) {
      api
        .get("/messages/unread-count")
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

  const usesRoleNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/exhibitor" ||
    location.pathname.startsWith("/exhibitor/") ||
    ((location.pathname === "/messages" || location.pathname === "/feedback") &&
      (user?.role === "admin" || user?.role === "exhibitor"));

  if (usesRoleNavbar) return null;

  const getNavItems = (): NavItem[] => {
    if (!user) {
      return [
        // 🔴 Login — brand primary CTA
        {
          id: "login",
          name: "Login",
          bg: PRIMARY,
          textColor: "#ffffff",
          href: "/login",
          isRoute: true,
        },
        {
          id: "register",
          name: "Register Pass",
          bg: KIWI,
          textColor: "#000000",
          href: "/register",
          isRoute: true,
        },
        {
          id: "expos",
          name: "Expos",
          bg: "var(--color-selective-yellow, #feb804)",
          textColor: INK,
          href: "/expos",
          isRoute: true,
        },
        {
          id: "exhibitors",
          name: "Exhibitors",
          bg: "var(--color-purple-mimosa, #a67eff)",
          textColor: "#ffffff",
          href: "/exhibitors",
          isRoute: true,
        },
        {
          id: "about",
          name: "About",
          bg: CREAM,
          textColor: INK,
          href: "/about",
          isRoute: true,
        },
        {
          id: "contact",
          name: "Contact",
          bg: "var(--color-light-salmon, #ffa490)",
          textColor: INK,
          href: "/contact",
          isRoute: true,
        },
      ];
    }

    if (user.role === "attendee") {
      return [
        {
          id: "schedule",
          name: "My Schedule",
          bg: KIWI,
          textColor: "#000000",
          href: "/schedule",
          isRoute: true,
        },
        {
          id: "messages",
          name: "Messages",
          bg: "var(--color-cerulean, #14a6ea)",
          textColor: "#ffffff",
          href: "/messages",
          isRoute: true,
          badge: unreadCount,
        },
        {
          id: "expos",
          name: "Expos",
          bg: "var(--color-selective-yellow, #feb804)",
          textColor: INK,
          href: "/expos",
          isRoute: true,
        },
        {
          id: "exhibitors",
          name: "Exhibitors",
          bg: "var(--color-purple-mimosa, #a67eff)",
          textColor: "#ffffff",
          href: "/exhibitors",
          isRoute: true,
        },
        {
          id: "feedback",
          name: "Feedback",
          bg: "var(--color-light-salmon, #ffa490)",
          textColor: INK,
          href: "/feedback",
          isRoute: true,
        },
      ];
    }

    if (user.role === "admin") {
      return [
        {
          id: "dashboard",
          name: "Admin Dashboard",
          bg: PRIMARY,
          textColor: "#ffffff",
          href: "/admin",
          isRoute: true,
        },
        {
          id: "messages",
          name: "Messages",
          bg: "var(--color-cerulean, #14a6ea)",
          textColor: "#ffffff",
          href: "/messages",
          isRoute: true,
          badge: unreadCount,
        },
        {
          id: "expos",
          name: "Expos",
          bg: "var(--color-selective-yellow, #feb804)",
          textColor: INK,
          href: "/expos",
          isRoute: true,
        },
        {
          id: "exhibitors",
          name: "Exhibitors",
          bg: "var(--color-purple-mimosa, #a67eff)",
          textColor: "#ffffff",
          href: "/exhibitors",
          isRoute: true,
        },
      ];
    }

    return [
      {
        id: "dashboard",
        name: "Exhibitor Portal",
        bg: "var(--color-purple-mimosa, #a67eff)",
        textColor: "#ffffff",
        href: "/exhibitor",
        isRoute: true,
      },
      {
        id: "messages",
        name: "Messages",
        bg: "var(--color-cerulean, #14a6ea)",
        textColor: "#ffffff",
        href: "/messages",
        isRoute: true,
        badge: unreadCount,
      },
      {
        id: "expos",
        name: "Expos",
        bg: "var(--color-selective-yellow, #feb804)",
        textColor: INK,
        href: "/expos",
        isRoute: true,
      },
      {
        id: "exhibitors",
        name: "Exhibitors",
        bg: KIWI,
        textColor: "#000000",
        href: "/exhibitors",
        isRoute: true,
      },
    ];
  };

  const navItems = getNavItems();

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
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
        if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
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
      {/* ---------------- BRAND ---------------- */}
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        whileHover={{ scale: 1.015 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          pointerEvents,
          backgroundColor: "rgba(35, 30, 37, 0.72)",
          padding: "5px 14px 5px 5px",
          borderRadius: 26,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1.2px solid rgba(255,255,255,0.25)",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.3)",
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", display: "inline-flex" }}
          aria-label="EventSphere home"
        >
          <RetroTvLogo />
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--color-kiwi, #abf139)",
              border: "1.5px solid #000",
              boxShadow: "0 0 8px var(--color-kiwi, #abf139)",
              marginLeft: 6,
              flexShrink: 0,
            }}
          />
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#fff",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: "clamp(180px, 24vw, 320px)",
          }}
        >
          <span
            style={{
              fontSize: 15,
              marginRight: 6,
              opacity: 0.9,
              color: KIWI,
            }}
          >
            [
          </span>
          <div style={{ overflow: "hidden", display: "inline-flex" }}>
            <div className="marquee-track" style={{ animationDuration: "14s" }}>
              <span style={{ marginRight: 20 }}>
                EventSphere Management Expo OS
              </span>
              <span style={{ marginRight: 20 }}>
                EventSphere Management Expo OS
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: 15,
              marginLeft: 6,
              opacity: 0.9,
              color: KIWI,
            }}
          >
            ]
          </span>
        </div>
      </motion.div>

      {/* ---------------- TOP RIGHT: vertical floating pills ---------------- */}
      <motion.nav
        className="desktop-menu-column"
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 11,
          pointerEvents,
        }}
      >
        {navItems.map((item, i) => {
          const isActive = !!item.isRoute && location.pathname === item.href;

          if (user && item.id === "schedule") {
            return (
              <div
                key={item.id}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <NotificationBell />
                <NavButton
                  name={item.name}
                  href={item.href}
                  bg={item.bg}
                  textColor={item.textColor}
                  badge={item.badge}
                  isActive={isActive}
                  index={i}
                  onClick={(e) => handleItemClick(e, item)}
                />
              </div>
            );
          }

          return (
            <NavButton
              key={item.id}
              name={item.name}
              href={item.href}
              bg={item.bg}
              textColor={item.textColor}
              badge={item.badge}
              isActive={isActive}
              index={i}
              onClick={(e) => handleItemClick(e, item)}
            />
          );
        })}

        {/* Logout — larger pill */}
        {user && (
          <motion.button
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
              delay: navItems.length * 0.045,
            }}
            whileHover={{
              scale: 1.05,
              x: -3,
              boxShadow: `5px 5px 0px ${INK}`,
            }}
            whileTap={{
              scale: 0.96,
              x: 1,
              y: 1,
              boxShadow: `1.5px 1.5px 0px ${INK}`,
            }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              padding: "10px 22px",
              borderRadius: 9999,
              backgroundColor: CREAM,
              color: INK,
              border: `2.5px solid ${INK}`,
              boxShadow: `3px 3px 0px ${INK}`,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.014em",
              cursor: "pointer",
              marginTop: 1,
              minHeight: 40,
            }}
          >
            Logout · {user.name?.split(" ")[0]}
          </motion.button>
        )}
      </motion.nav>

      {/* ---------------- MOBILE TOGGLE ---------------- */}
      <motion.button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-toggle-btn"
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
        whileTap={{ scale: 0.94, x: 1, y: 1 }}
        style={{
          padding: "10px 20px",
          borderRadius: 12,
          backgroundColor: mobileOpen ? PRIMARY : CREAM,
          color: mobileOpen ? "#ffffff" : INK,
          border: `2.5px solid ${INK}`,
          boxShadow: mobileOpen
            ? `1.5px 1.5px 0px ${INK}`
            : `3.5px 3.5px 0px ${INK}`,
          cursor: "pointer",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: "0.02em",
          pointerEvents,
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: mobileOpen ? CREAM : KIWI,
            border: `1.5px solid ${INK}`,
          }}
        />
        {mobileOpen ? "Close" : "Menu"}
      </motion.button>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              position: "fixed",
              top: 78,
              left: 16,
              right: 16,
              backgroundColor: CREAM,
              border: `2.5px solid ${INK}`,
              borderRadius: 16,
              boxShadow: `6px 6px 0px ${INK}`,
              padding: "18px 18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pointerEvents: "auto",
              zIndex: 150,
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            {user && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 14,
                  marginBottom: 8,
                  borderBottom: `2px dashed ${INK}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    opacity: 0.55,
                    color: INK,
                  }}
                >
                  Notifications
                </span>
                <NotificationBell />
              </div>
            )}

            {navItems.map((item, i) => {
              const isActive =
                !!item.isRoute && location.pathname === item.href;

              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.045 }}
                  whileTap={{ scale: 0.98, x: 2 }}
                  style={{
                    color: isActive ? PRIMARY : INK,
                    textDecoration: "none",
                    padding: "13px 12px",
                    borderRadius: 12,
                    fontSize: 17,
                    borderBottom: `1.5px dashed rgba(35,30,37,0.28)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 800,
                    backgroundColor: isActive
                      ? "rgba(255,62,51,0.09)"
                      : "transparent",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      flexShrink: 0,
                      borderRadius: 7,
                      backgroundColor: item.bg,
                      border: `1.5px solid ${INK}`,
                      boxShadow: `1.5px 1.5px 0px ${INK}`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 900,
                      color: item.textColor,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span style={{ flex: 1 }}>{item.name}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: PRIMARY,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 900,
                        borderRadius: 11,
                        padding: "3px 8px",
                        border: `1.5px solid ${INK}`,
                      }}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}

                  <span style={{ opacity: 0.35, fontSize: 14 }}>→</span>
                </motion.a>
              );
            })}

            {user && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                  navigate("/login");
                }}
                style={{
                  marginTop: 16,
                  padding: "14px",
                  backgroundColor: INK,
                  color: CREAM,
                  border: `2px solid ${INK}`,
                  borderRadius: 12,
                  boxShadow: `3px 3px 0px ${INK}`,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                }}
              >
                Logout
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .desktop-menu-column { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }
        @media (min-width: 861px) {
          .mobile-toggle-btn { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
};