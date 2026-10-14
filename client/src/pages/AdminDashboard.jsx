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

// Floor Plan Booth Allocation Data for Donut Chart
const BOOTH_PIE_DATA = [
  { name: "Allocated", value: 142, color: "var(--color-primary, #ff3e33)" },
  { name: "Pending", value: 68, color: "var(--color-selective-yellow, #feb804)" },
  { name: "Available", value: 45, color: "var(--color-kiwi, #abf139)" },
  { name: "Unassigned", value: 25, color: "var(--color-purple-mimosa, #a67eff)" },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExpos: 0,
    pendingApps: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSlice, setActiveSlice] = useState(null);

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

  const quickLinks = [
    {
      to: "/admin/expos",
      tag: "CORE EXPOS",
      bg: "var(--color-primary, #ff3e33)",
      textColor: "#ffffff",
      handleColor: "#ffffff",
      title: "MANAGE EXPOS",
      desc: "Create expos, update event details, manage schedules, and configure floor plans and booth spaces.",
    },
    {
      to: "/admin/applications",
      tag: "APPROVALS",
      bg: "var(--color-selective-yellow, #feb804)",
      textColor: "#000000",
      handleColor: "#000000",
      title: "EXHIBITOR APPS",
      desc: "Review exhibitor applications and update their approval status and booth allocations.",
    },
    {
      to: "/admin/analytics",
      tag: "INTELLIGENCE",
      bg: "var(--color-kiwi, #abf139)",
      textColor: "#000000",
      handleColor: "#000000",
      title: "EVENT ANALYTICS",
      desc: "Review reports on attendee registrations, exhibitor activity, and session interest.",
    },
    {
      to: "/messages",
      tag: "INBOX",
      bg: "var(--color-purple-mimosa, #a67eff)",
      textColor: "#ffffff",
      handleColor: "#ffffff",
      title: "MESSAGES",
      desc: "Review and respond to event-related messages from exhibitors and attendees.",
    },
    {
      to: "/admin/feedback",
      tag: "REVIEWS",
      bg: "var(--color-light-salmon, #ffa490)",
      textColor: "#000000",
      handleColor: "#000000",
      title: "USER FEEDBACK",
      desc: "Review feedback submitted by attendees and exhibitors.",
    },
    {
      to: "/feedback",
      tag: "INTERNAL",
      bg: "var(--color-cerulean, #14a6ea)",
      textColor: "#ffffff",
      handleColor: "#ffffff",
      title: "SUBMIT SUGGESTION",
      desc: "Send feedback about EventSphere or suggest improvements.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36, padding: "10px 0" }}>
      
      {/* 1. Header Hero Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "7px 7px 0px var(--color-dark, #231e25)",
          padding: "28px 32px",
          display: "block",
          flexWrap: "wrap",
          gap: 20,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ backgroundColor: "var(--color-dark, #231e25)", color: "var(--color-light, #fff8eb)", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              ORGANIZER DASHBOARD
            </span>
            <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              EXPO MANAGEMENT
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(42px, 5.5vw, 60px)", color: "var(--color-dark, #231e25)", lineHeight: 0.88, margin: "4px 0 0 0" }}>
            MANAGE YOUR EXPOS
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, color: "#4b5563", margin: 0, fontWeight: 500 }}>
            Welcome, <strong style={{ color: "var(--color-dark, #231e25)" }}>{user?.name || "Organizer"}</strong>. Manage expo details, exhibitor applications, booth spaces, and schedules.
          </p>
        </div>

        <Link
          to="/admin/expos"
          style={{
            backgroundColor: "var(--color-primary, #ff3e33)",
            color: "#ffffff",
            border: "2.5px solid var(--color-dark, #231e25)",
            boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
            padding: "12px 26px",
            borderRadius: 4,
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontSize: 22,
            letterSpacing: 1,
            display: "inline-block",
          }}
        >
          CREATE NEW EXPO
        </Link>
      </div>

      {/* 2. Top Stats & Interactive Donut Chart Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        {/* Left Side: 2 Big Metric Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Metric 1 */}
          <motion.div
            whileHover={{ y: -4, boxShadow: "7px 7px 0px var(--color-dark, #231e25)" }}
            style={{
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
              padding: "24px 28px",
              display: "block",
            }}
          >
            <div>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#6b7280" }}>
                ACTIVE EXPOS ON PLATFORM
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 64, color: "var(--color-dark, #231e25)", lineHeight: 1, margin: "6px 0 0 0" }}>
                {loading ? "..." : stats.totalExpos}
              </div>
            </div>
          </motion.div>

          {/* Metric 2 */}
          <motion.div
            whileHover={{ y: -4, boxShadow: "7px 7px 0px var(--color-dark, #231e25)" }}
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
              padding: "24px 28px",
              display: "block",
            }}
          >
            <div>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#000000" }}>
                PENDING EXHIBITOR APPLICATIONS
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 64, color: "var(--color-dark, #231e25)", lineHeight: 1, margin: "6px 0 0 0" }}>
                {loading ? "..." : stats.pendingApps}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Neo-Brutalist Donut Chart */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 1, color: "var(--color-dark)" }}>
                EXAMPLE BOOTH ALLOCATION
              </span>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#6b7280", margin: "2px 0 0 0", fontWeight: 600 }}>
                Illustrative figures only; see analytics for current event information.
              </p>
            </div>
            <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000", padding: "2px 8px", fontSize: 11, fontWeight: 800, borderRadius: 2 }}>
              EXAMPLE DATA
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", marginTop: 12 }}>
            {/* Donut Chart Container */}
            <div style={{ position: "relative", width: "100%", height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ backgroundColor: "#000000", color: "#ffffff", padding: "6px 10px", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700 }}>
                            {payload[0].name}: {payload[0].value} Booths
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
                    innerRadius={52}
                    outerRadius={78}
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
                          transform: activeSlice === index ? "scale(1.06)" : "scale(1)",
                          transformOrigin: "center center",
                          transition: "transform 0.2s ease",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metric in the Donut Hole */}
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
                <span style={{ fontFamily: "var(--font-display)", fontSize: 28, lineHeight: 0.9, color: "var(--color-dark)" }}>
                  SAMPLE
                </span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, fontWeight: 800, color: "#6b7280" }}>
                  DATA
                </span>
              </div>
            </div>

            {/* Brutalist Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {BOOTH_PIE_DATA.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, backgroundColor: item.color, border: "1.5px solid #000", flexShrink: 0, borderRadius: 2 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                    <span style={{ color: "#374151" }}>{item.name}</span>
                    <span style={{ fontWeight: 800, color: "#000" }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Restyled Quick Action Modules with Viewfinder Handles */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-primary, #ff3e33)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--color-dark, #231e25)", margin: 0, letterSpacing: 1 }}>
            ADMINISTRATION WORKSPACES
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {quickLinks.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -8, boxShadow: "8px 8px 0px var(--color-dark, #231e25)" }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "visible",
              }}
            >
              {/* 4 Corner Viewfinder Handles */}
              <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: item.handleColor, border: "1.5px solid #000", zIndex: 10 }} />
              <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: item.handleColor, border: "1.5px solid #000", zIndex: 10 }} />
              <div style={{ position: "absolute", bottom: -5, left: -5, width: 9, height: 9, backgroundColor: item.handleColor, border: "1.5px solid #000", zIndex: 10 }} />
              <div style={{ position: "absolute", bottom: -5, right: -5, width: 9, height: 9, backgroundColor: item.handleColor, border: "1.5px solid #000", zIndex: 10 }} />

              {/* Card Colored Banner Header */}
              <div
                style={{
                  backgroundColor: item.bg,
                  color: item.textColor,
                  borderBottom: "3px solid var(--color-dark, #231e25)",
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1 }}>
                  {item.tag}
                </span>
                <span style={{ fontSize: 13, fontWeight: 900, backgroundColor: "#000", color: "#fff", padding: "2px 6px", borderRadius: 2 }}>
                  EVENTSPHERE
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 16 }}>
                <div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--color-dark, #231e25)", margin: "0 0 8px 0", letterSpacing: 0.5 }}>
                    {item.title}
                  </h4>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#4b5563", lineHeight: 1.45, margin: 0, fontWeight: 500 }}>
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.to}
                  style={{
                    backgroundColor: "var(--color-dark, #231e25)",
                    color: "var(--color-light, #fff8eb)",
                    border: "2px solid var(--color-dark, #231e25)",
                    padding: "10px 18px",
                    borderRadius: 4,
                    textDecoration: "none",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span>LAUNCH WORKSPACE</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;