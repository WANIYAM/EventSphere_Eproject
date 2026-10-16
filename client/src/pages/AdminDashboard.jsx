import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  TickerStrip,
  RotatingBadge,
  Scanline,
  TickStrip,
  GrainOverlay,
} from "../components/common/NeoBrutalKit.jsx";

/* ─────────────────────────────────────────────────────────
   EXAMPLE CHART DATA (unchanged, marked as illustrative)
   ───────────────────────────────────────────────────────── */
const BOOTH_PIE_DATA = [
  { name: "Allocated", value: 142, color: "var(--color-primary, #ff3e33)" },
  { name: "Pending", value: 68, color: "var(--color-selective-yellow, #feb804)" },
  { name: "Available", value: 45, color: "var(--color-kiwi, #abf139)" },
  { name: "Unassigned", value: 25, color: "var(--color-purple-mimosa, #a67eff)" },
];

const DONUT_TOTAL = BOOTH_PIE_DATA.reduce((s, d) => s + d.value, 0);

/* Small "mini-bars" sparkline used inside metric cards */
const MiniSpark = ({ data, color = "#000", height = 34 }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
    {data.map((v, i) => (
      <motion.span
        key={i}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.04, type: "spring", stiffness: 220, damping: 20 }}
        style={{
          display: "block",
          width: 6,
          height: `${v * 100}%`,
          background: color,
          transformOrigin: "bottom",
          borderRadius: 1,
        }}
      />
    ))}
  </div>
);

/* Renders the section indicator + title */
const SectionHeading = ({ accent, title, subtitle }) => (
  <div style={{ marginBottom: 18 }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: accent,
        color: "#fff",
        padding: "3px 10px",
        borderRadius: 3,
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 1.2,
        border: "1.5px solid #000",
        boxShadow: "2px 2px 0 #000",
        marginBottom: 8,
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      <PulseDot color="#fff" size={6} glow={false} />
      ADMINISTRATION
    </div>
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(24px, 3vw, 34px)",
        color: "var(--color-dark, #231e25)",
        margin: 0,
        letterSpacing: 1,
        lineHeight: 1,
      }}
    >
      {title}
    </h3>
    {subtitle && (
      <p
        style={{
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 13,
          color: "#6b7280",
          margin: "6px 0 0 0",
          fontWeight: 600,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalExpos: 0, pendingApps: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSlice, setActiveSlice] = useState(null);
  const [now, setNow] = useState(new Date());

  // Tiny clock for "as of" indicator
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [exposRes, appsRes] = await Promise.all([
          api.get("/expos"),
          api.get("/applications?status=pending"),
        ]);
        setStats({
          totalExpos: exposRes.data.length,
          pendingApps: appsRes.data.length,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  /* ── Quick links — enriched with icon, sub-stat and accent ── */
  const quickLinks = [
    {
      to: "/admin/expos",
      tag: "CORE EXPOS",
      bg: "var(--color-primary, #ff3e33)",
      textColor: "#ffffff",
      handleColor: "#ffffff",
      title: "MANAGE EXPOS",
      desc: "Create expos, update event details, manage schedules, and configure floor plans and booth spaces.",
      icon: "🏛",
      stat: `${stats.totalExpos} active`,
      badge: "PRIMARY",
      hero: true,
    },
    {
      to: "/admin/applications",
      tag: "APPROVALS",
      bg: "var(--color-selective-yellow, #feb804)",
      textColor: "#000000",
      handleColor: "#000000",
      title: "EXHIBITOR APPS",
      desc: "Review exhibitor applications and update their approval status and booth allocations.",
      icon: "📋",
      stat: `${stats.pendingApps} pending`,
      badge: stats.pendingApps > 0 ? "NEEDS REVIEW" : "CLEAR",
      alert: stats.pendingApps > 0,
    },
    {
      to: "/admin/analytics",
      tag: "INTELLIGENCE",
      bg: "var(--color-kiwi, #abf139)",
      textColor: "#000000",
      handleColor: "#000000",
      title: "EVENT ANALYTICS",
      desc: "Review reports on attendee registrations, exhibitor activity, and session interest.",
      icon: "📊",
      stat: "6 reports",
      badge: "INSIGHTS",
    },
    {
      to: "/messages",
      tag: "INBOX",
      bg: "var(--color-purple-mimosa, #a67eff)",
      textColor: "#ffffff",
      handleColor: "#ffffff",
      title: "MESSAGES",
      desc: "Review and respond to event-related messages from exhibitors and attendees.",
      icon: "💬",
      stat: "Open inbox",
      badge: "REALTIME",
    },
    {
      to: "/admin/feedback",
      tag: "REVIEWS",
      bg: "var(--color-light-salmon, #ffa490)",
      textColor: "#000000",
      handleColor: "#000000",
      title: "USER FEEDBACK",
      desc: "Review feedback submitted by attendees and exhibitors.",
      icon: "⭐",
      stat: "Community",
      badge: "MODERATE",
    },
    {
      to: "/feedback",
      tag: "INTERNAL",
      bg: "var(--color-cerulean, #14a6ea)",
      textColor: "#ffffff",
      handleColor: "#ffffff",
      title: "SUBMIT SUGGESTION",
      desc: "Send feedback about EventSphere or suggest improvements.",
      icon: "💡",
      stat: "Send to crew",
      badge: "INTERNAL",
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        padding: "4px 4px 40px 4px",
      }}
    >
      {/* ═══════════════════════ TOP TICKER ═══════════════════════ */}
      <div
        style={{
          backgroundColor: "var(--color-dark, #231e25)",
          borderRadius: 4,
          padding: "5px 0",
          border: "2px solid #000",
          boxShadow: "3px 3px 0 #000",
        }}
      >
        <TickerStrip
          items={[
            "REAL-TIME EXPOS · BOOTH ALLOCATIONS · SCHEDULE UPDATES",
            "PENDING APPLICATIONS REVIEWED",
            "ANALYTICS SYNCED",
            `AS OF ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          ]}
          color="var(--color-kiwi, #abf139)"
          duration={28}
          fontSize={11}
        />
      </div>

      {/* ═══════════════════════ HEADER HERO ═══════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          padding: "clamp(22px, 3vw, 32px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={10} size={13} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />

        <RotatingBadge
          text="LIVE OPS"
          size={92}
          bg="var(--color-kiwi, #abf139)"
          color="#000"
          top={-22}
          right={-22}
          duration={15}
          tilt={6}
        />

        {/* Top row: pills + CTA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 20,
            alignItems: "start",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: "var(--color-dark, #231e25)",
                  color: "var(--color-light, #fff8eb)",
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  border: "1.5px solid #000",
                }}
              >
                <PulseDot color="var(--color-primary, #ff3e33)" size={6} glow={false} />
                ORGANIZER DASHBOARD
              </span>

              <span
                style={{
                  backgroundColor: "var(--color-kiwi, #abf139)",
                  color: "#000",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  border: "1.5px solid #000",
                  transform: "rotate(-1deg)",
                }}
              >
                EXPO MANAGEMENT
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display, 'Bebas Neue')",
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.9,
                margin: "4px 0 8px 0",
                letterSpacing: 1,
              }}
            >
              MANAGE YOUR{" "}
              <span style={{ color: "var(--color-primary, #ff3e33)" }}>EXPOS</span>
            </h1>

            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                color: "#4b5563",
                margin: 0,
                fontWeight: 500,
                maxWidth: 560,
                lineHeight: 1.5,
              }}
            >
              Welcome,{" "}
              <strong style={{ color: "var(--color-dark, #231e25)" }}>
                {user?.name || "Organizer"}
              </strong>
              . Manage expo details, exhibitor applications, booth spaces, and schedules.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f9fafb",
                border: "1.5px solid #000",
                boxShadow: "2px 2px 0 #000",
                padding: "4px 10px",
                borderRadius: 20,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: "#4b5563",
              }}
            >
              <PulseDot color="var(--color-kiwi, #abf139)" size={6} glow={false} />
              SYNCED · {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>

            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/admin/expos"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "var(--color-primary, #ff3e33)",
                  color: "#ffffff",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                  padding: "12px 24px",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  letterSpacing: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ShineSweep duration={1.4} delay={0} opacity={0.35} />
                <span>+</span>
                CREATE NEW EXPO
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom row: quick stat pills */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            paddingTop: 16,
            marginTop: 18,
            borderTop: "2px dashed var(--color-dark, #231e25)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {[
            { label: "ACTIVE EXPOS", value: loading ? "…" : stats.totalExpos, bg: "var(--color-primary, #ff3e33)", fg: "#fff" },
            { label: "PENDING APPS", value: loading ? "…" : stats.pendingApps, bg: "var(--color-selective-yellow, #feb804)", fg: "#000" },
            { label: "MESSAGES", value: "Inbox", bg: "var(--color-purple-mimosa, #a67eff)", fg: "#fff" },
            { label: "ANALYTICS", value: "Ready", bg: "var(--color-kiwi, #abf139)", fg: "#000" },
          ].map((pill) => (
            <span
              key={pill.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: pill.bg,
                color: pill.fg,
                border: "2px solid #000",
                boxShadow: "2px 2px 0 #000",
                padding: "5px 12px",
                borderRadius: 30,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.6,
              }}
            >
              <PulseDot color={pill.fg} glow={false} size={6} />
              {pill.label}:
              <span style={{ fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 0.4 }}>
                {pill.value}
              </span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════ METRICS + DONUT ═══════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
          gap: 20,
          alignItems: "stretch",
        }}
        className="admin-metrics-grid"
      >
        {/* LEFT — stacked metric cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {/* Metric 1 — Active expos */}
          <motion.div
            whileHover={{ y: -4, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            style={{
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "22px 24px",
              position: "relative",
              overflow: "hidden",
              flex: 1,
            }}
          >
            <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
            <ShineSweep duration={1.5} delay={0.15} opacity={0.3} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--color-primary, #ff3e33)",
                    border: "2px solid #000",
                    boxShadow: "2px 2px 0 #000",
                    borderRadius: 4,
                    fontSize: 16,
                  }}
                >
                  🏛
                </span>
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#6b7280",
                  }}
                >
                  ACTIVE EXPOS
                </span>
              </div>
              <span
                style={{
                  background: "var(--color-kiwi, #abf139)",
                  border: "1.5px solid #000",
                  padding: "2px 8px",
                  borderRadius: 30,
                  fontSize: 10,
                  fontWeight: 900,
                  fontFamily: "'Satoshi', sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                ▲ LIVE
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginTop: 4 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px, 6vw, 64px)",
                  color: "var(--color-dark, #231e25)",
                  lineHeight: 0.9,
                  letterSpacing: 1,
                }}
              >
                {loading ? "…" : stats.totalExpos}
              </div>
              <MiniSpark data={[0.3, 0.5, 0.4, 0.7, 0.5, 0.85, 1]} color="var(--color-primary, #ff3e33)" />
            </div>

            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1.5px dashed #000",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 11,
                fontWeight: 800,
                color: "#4b5563",
              }}
            >
              <span>On-platform listings</span>
              <Link to="/admin/expos" style={{ color: "var(--color-dark, #231e25)", textDecoration: "underline" }}>
                View all →
              </Link>
            </div>
          </motion.div>

          {/* Metric 2 — Pending apps */}
          <motion.div
            whileHover={{ y: -4, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "22px 24px",
              position: "relative",
              overflow: "hidden",
              flex: 1,
            }}
          >
            <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
            <ShineSweep duration={1.5} delay={0.25} opacity={0.3} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--color-dark, #231e25)",
                    border: "2px solid #000",
                    boxShadow: "2px 2px 0 #000",
                    borderRadius: 4,
                    fontSize: 16,
                  }}
                >
                  📋
                </span>
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#000",
                  }}
                >
                  PENDING APPLICATIONS
                </span>
              </div>
              {stats.pendingApps > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  style={{
                    background: "var(--color-primary, #ff3e33)",
                    color: "#fff",
                    border: "1.5px solid #000",
                    padding: "2px 8px",
                    borderRadius: 30,
                    fontSize: 10,
                    fontWeight: 900,
                    fontFamily: "'Satoshi', sans-serif",
                    letterSpacing: 0.6,
                  }}
                >
                  ⚠ ACTION
                </motion.span>
              )}
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 6vw, 64px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.9,
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              {loading ? "…" : stats.pendingApps}
            </div>

            {/* Mini progress bar */}
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  height: 6,
                  background: "rgba(0,0,0,0.15)",
                  border: "1.5px solid #000",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.pendingApps / 10) * 100, 100)}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "var(--color-primary, #ff3e33)",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0 4px, transparent 4px 8px)",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                <span>Applications awaiting review</span>
                <Link to="/admin/applications" style={{ color: "#000", textDecoration: "underline" }}>
                  Review →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — donut hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
            padding: "24px 26px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
          <ShineSweep duration={1.6} delay={0.15} opacity={0.22} />
          <Scanline color="rgba(20,166,234,0.22)" height={70} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              position: "relative",
              zIndex: 2,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--color-purple-mimosa, #a67eff)",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: 3,
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 1,
                  border: "1.5px solid #000",
                  boxShadow: "2px 2px 0 #000",
                  marginBottom: 8,
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                <PulseDot color="#fff" size={6} glow={false} />
                FLOOR MAP · SAMPLE
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 2.4vw, 26px)",
                  margin: 0,
                  letterSpacing: 0.8,
                  lineHeight: 1,
                }}
              >
                BOOTH ALLOCATION
              </h3>
              <p
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 11.5,
                  color: "#6b7280",
                  margin: "4px 0 0 0",
                  fontWeight: 600,
                  maxWidth: 320,
                }}
              >
                Illustrative figures only · see analytics for real-time data
              </p>
            </div>
            <span
              style={{
                backgroundColor: "var(--color-selective-yellow, #feb804)",
                border: "1.5px solid #000",
                padding: "3px 9px",
                fontSize: 10,
                fontWeight: 900,
                borderRadius: 3,
                letterSpacing: 0.8,
                fontFamily: "'Satoshi', sans-serif",
                flexShrink: 0,
              }}
            >
              EXAMPLE DATA
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
              gap: 18,
              alignItems: "center",
              marginTop: 16,
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Donut */}
            <div style={{ position: "relative", width: "100%", height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div
                            style={{
                              backgroundColor: "#000000",
                              color: "#ffffff",
                              padding: "6px 10px",
                              borderRadius: 4,
                              fontFamily: "'Satoshi', sans-serif",
                              fontSize: 12,
                              fontWeight: 700,
                              border: "2px solid var(--color-kiwi, #abf139)",
                            }}
                          >
                            {payload[0].name}: {payload[0].value} booths
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={BOOTH_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveSlice(index)}
                    onMouseLeave={() => setActiveSlice(null)}
                  >
                    {BOOTH_PIE_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#000000"
                        strokeWidth={2}
                        style={{
                          transform: activeSlice === index ? "scale(1.08)" : "scale(1)",
                          transformOrigin: "center center",
                          transition: "transform 0.2s ease",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Donut center */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <motion.span
                  key={activeSlice}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 34,
                    lineHeight: 0.9,
                    color: "var(--color-dark, #231e25)",
                    letterSpacing: 1,
                  }}
                >
                  {activeSlice !== null ? BOOTH_PIE_DATA[activeSlice].value : DONUT_TOTAL}
                </motion.span>
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 9.5,
                    fontWeight: 900,
                    letterSpacing: 1,
                    color: "#6b7280",
                    marginTop: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {activeSlice !== null ? BOOTH_PIE_DATA[activeSlice].name : "Total Booths"}
                </span>
              </div>
            </div>

            {/* Legend / stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {BOOTH_PIE_DATA.map((item) => {
                const pct = Math.round((item.value / DONUT_TOTAL) * 100);
                const active = activeSlice === BOOTH_PIE_DATA.indexOf(item);

                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 4 }}
                    onMouseEnter={() => setActiveSlice(BOOTH_PIE_DATA.indexOf(item))}
                    onMouseLeave={() => setActiveSlice(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 10px",
                      border: "1.5px solid #000",
                      borderRadius: 4,
                      background: active ? "rgba(0,0,0,0.04)" : "#fff",
                      boxShadow: active ? "3px 3px 0 #000" : "none",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        border: "1.5px solid #000",
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11.5,
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 800,
                          color: "#231e25",
                        }}
                      >
                        <span>{item.name}</span>
                        <span>{item.value}</span>
                      </div>
                      <div
                        style={{
                          height: 3,
                          marginTop: 4,
                          background: "rgba(0,0,0,0.1)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ height: "100%", background: item.color }}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        letterSpacing: 0.4,
                        color: "#6b7280",
                        minWidth: 34,
                        textAlign: "right",
                      }}
                    >
                      {pct}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1.5px dashed #000",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: "#4b5563",
              flexWrap: "wrap",
              gap: 8,
              position: "relative",
              zIndex: 2,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PulseDot color="var(--color-purple-mimosa, #a67eff)" size={6} glow={false} />
              Hover a slice to inspect counts
            </span>
            <Link
              to="/admin/analytics"
              style={{ color: "var(--color-dark, #231e25)", textDecoration: "underline" }}
            >
              Open full analytics →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════ QUICK LINKS ═══════════════════════ */}
      <div>
        <SectionHeading
          accent="var(--color-primary, #ff3e33)"
          title="ADMINISTRATION WORKSPACES"
          subtitle="Jump into a specific module. Primary operations first."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
          }}
          className="admin-quick-grid"
        >
          {quickLinks.map((item, idx) => {
            const isHero = Boolean(item.hero);
            const spanCols = isHero ? 2 : 1;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06, type: "spring", stiffness: 260, damping: 22 }}
                whileHover={{
                  y: -8,
                  boxShadow: `9px 9px 0px ${item.bg}`,
                  rotate: isHero ? -0.3 : idx % 2 === 0 ? -0.5 : 0.5,
                }}
                style={{
                  gridColumn: `span ${spanCols}`,
                  backgroundColor: "#ffffff",
                  border: "3px solid var(--color-dark, #231e25)",
                  boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: isHero ? 300 : 250,
                }}
              >
                <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
                <ShineSweep duration={1.7} delay={0.08 + idx * 0.05} opacity={0.22} />

                {/* Banner */}
                <div
                  style={{
                    backgroundColor: item.bg,
                    color: item.textColor,
                    borderBottom: "3px solid var(--color-dark, #231e25)",
                    padding: "12px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-display)",
                      fontSize: isHero ? 20 : 17,
                      letterSpacing: 0.8,
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 4,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.2)",
                        border: "1.5px solid #000",
                        fontSize: 14,
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.tag}
                  </span>

                  <motion.span
                    animate={item.alert ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      background: item.alert ? "#000" : "rgba(0,0,0,0.75)",
                      color: "#fff",
                      padding: "3px 8px",
                      borderRadius: 3,
                      letterSpacing: 0.8,
                      fontFamily: "'Satoshi', sans-serif",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {item.alert && <PulseDot color="var(--color-primary, #ff3e33)" size={5} glow={false} />}
                    {item.badge}
                  </motion.span>
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: isHero ? "24px 24px" : "20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: 1,
                    gap: 16,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: isHero ? "clamp(28px, 3vw, 40px)" : 24,
                        color: "var(--color-dark, #231e25)",
                        margin: "0 0 8px 0",
                        letterSpacing: 0.5,
                        lineHeight: 0.95,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: isHero ? 14.5 : 13,
                        color: "#4b5563",
                        lineHeight: 1.5,
                        margin: 0,
                        fontWeight: 500,
                        maxWidth: isHero ? 560 : "100%",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      paddingTop: 10,
                      borderTop: "1.5px dashed #000",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#6b7280",
                        letterSpacing: 0.5,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <PulseDot color={item.bg} size={6} glow={false} />
                      {item.stat}
                    </span>

                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 450, damping: 20 }}>
                      <Link
                        to={item.to}
                        style={{
                          backgroundColor: "var(--color-dark, #231e25)",
                          color: "var(--color-light, #fff8eb)",
                          border: "2px solid var(--color-dark, #231e25)",
                          boxShadow: "3px 3px 0 var(--color-dark, #231e25)",
                          padding: "10px 16px",
                          borderRadius: 4,
                          textDecoration: "none",
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          letterSpacing: 0.6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        LAUNCH WORKSPACE
                        <span style={{ fontSize: 12 }}>→</span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* System status card — fills last row, spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              gridColumn: "span 2",
              backgroundColor: "var(--color-dark, #231e25)",
              color: "#fff",
              border: "3px solid #000",
              boxShadow: "6px 6px 0px var(--color-primary, #ff3e33)",
              padding: "20px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden",
              minHeight: 130,
            }}
          >
            <CornerBrackets color="#fff" inset={9} size={11} thickness={2} />
            <ShineSweep duration={1.8} delay={0.3} opacity={0.12} />

            <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-kiwi, #abf139)",
                  color: "#000",
                  border: "2px solid #000",
                  borderRadius: 8,
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                ⚡
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    letterSpacing: 0.8,
                    lineHeight: 1,
                  }}
                >
                  SYSTEM HEALTH
                </div>
                <p
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 12.5,
                    color: "rgba(255,255,255,0.75)",
                    margin: "4px 0 0 0",
                    fontWeight: 600,
                  }}
                >
                  All EventSphere services operational · 99.9% uptime
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                position: "relative",
                zIndex: 2,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: 0.8,
              }}
            >
              {[
                { l: "API", c: "var(--color-kiwi, #abf139)" },
                { l: "REALTIME", c: "var(--color-kiwi, #abf139)" },
                { l: "STORAGE", c: "var(--color-kiwi, #abf139)" },
              ].map((s) => (
                <span
                  key={s.l}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.08)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    padding: "5px 10px",
                    borderRadius: 20,
                    color: "#fff",
                  }}
                >
                  <PulseDot color={s.c} size={6} glow={false} />
                  {s.l}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════ BOTTOM CTA ═══════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "var(--color-dark, #231e25)",
          border: "3px solid #000",
          boxShadow: "8px 8px 0px var(--color-primary, #ff3e33)",
          padding: "22px 26px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CornerBrackets color="#fff" inset={10} size={13} thickness={2.5} />
        <ShineSweep duration={1.8} delay={0.3} opacity={0.15} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--color-kiwi, #abf139)",
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 1.4,
              fontFamily: "'Satoshi', sans-serif",
              marginBottom: 6,
            }}
          >
            <PulseDot color="var(--color-kiwi, #abf139)" size={6} />
            NEED A HAND?
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 2.4vw, 26px)",
              color: "#fff",
              margin: 0,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            SUBMIT A SUGGESTION OR REPORT AN ISSUE
          </p>
        </div>

        <motion.div
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <Link
            to="/feedback"
            style={{
              backgroundColor: "var(--color-kiwi, #abf139)",
              color: "#000",
              border: "2.5px solid #000",
              boxShadow: "4px 4px 0 #000",
              padding: "11px 24px",
              borderRadius: 4,
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              fontSize: 18,
              letterSpacing: 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            OPEN FEEDBACK LOG →
          </Link>
        </motion.div>
      </motion.div>

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 900px) {
          .admin-metrics-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .admin-quick-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .admin-quick-grid > * {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;