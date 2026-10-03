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

// Attendee Time & Schedule Distribution for Pie Chart
const SCHEDULE_PIE_DATA = [
  { name: "Keynote Stages", value: 6, color: "var(--color-primary, #ff3e33)" },
  { name: "Breakout Workshops", value: 4, color: "var(--color-kiwi, #abf139)" },
  { name: "B2B Networking", value: 5, color: "var(--color-purple-mimosa, #a67eff)" },
  { name: "Exhibition Floor Walk", value: 8, color: "var(--color-selective-yellow, #feb804)" },
];

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ expos: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSlice, setActiveSlice] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/registrations/my");
        const regs = res.data;
        setStats({
          expos: regs.filter((r) => r.type === "expo" && r.registered).length,
          sessions: regs.filter((r) => r.type === "session" && r.registered).length,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const attendeeLinks = [
    { to: "/attendee/expos", tag: "DIRECTORY", bg: "var(--color-cerulean, #14a6ea)", textColor: "#fff", title: "BROWSE EXPOS & MAPS", desc: "Discover upcoming trade shows, search exhibitors by category, and navigate interactive floor plans." },
    { to: "/attendee/schedule", tag: "TIMETABLE", bg: "var(--color-kiwi, #abf139)", textColor: "#000", title: "MY EXPO TIMETABLE", desc: "Access registered keynotes, workshops, and bookmarked sessions with live schedule reminders." },
    { to: "/messages", tag: "COMMUNICATION", bg: "var(--color-purple-mimosa, #a67eff)", textColor: "#fff", title: "INBOX & INQUIRIES", desc: "Initiate direct chats with exhibitors for product inquiries and book meeting appointments." },
    { to: "/feedback", tag: "SUPPORT", bg: "var(--color-selective-yellow, #feb804)", textColor: "#000", title: "FEEDBACK & REVIEWS", desc: "Share suggestions or report any venue or platform issues to help us improve your visit." },
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "var(--color-dark, #231e25)", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              [ ATTENDEE PASS // VERIFIED ]
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(42px, 5.5vw, 60px)", color: "var(--color-dark, #231e25)", lineHeight: 0.88, margin: "4px 0 0 0" }}>
            ATTENDEE PORTAL
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, color: "#4b5563", margin: 0, fontWeight: 500 }}>
            Welcome, <strong style={{ color: "var(--color-dark, #231e25)" }}>{user?.name}</strong>! Your personalized event planner, schedule, and passes.
          </p>
        </div>

        <Link
          to="/attendee/expos"
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
          EXPLORE EXPOS →
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
          <motion.div
            whileHover={{ y: -4, boxShadow: "7px 7px 0px var(--color-dark, #231e25)" }}
            style={{
              backgroundColor: "var(--color-kiwi, #abf139)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
              padding: "24px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#000" }}>
                REGISTERED EXPOS
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 64, color: "var(--color-dark, #231e25)", lineHeight: 1, margin: "6px 0 0 0" }}>
                {loading ? "..." : stats.expos}
              </div>
            </div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "2px solid #fff" }}>
              🎫
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: "7px 7px 0px var(--color-dark, #231e25)" }}
            style={{
              backgroundColor: "var(--color-purple-mimosa, #a67eff)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
              padding: "24px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#fff" }}>
                BOOKMARKED SESSIONS
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 64, color: "#ffffff", lineHeight: 1, margin: "6px 0 0 0" }}>
                {loading ? "..." : stats.sessions}
              </div>
            </div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#fff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "2px solid #000" }}>
              ⭐
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Donut Chart */}
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
                EVENT TIME ALLOCATION
              </span>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#6b7280", margin: "2px 0 0 0", fontWeight: 600 }}>
                23 Total Hours of Planned Stage Keynotes & Interactive Demos
              </p>
            </div>
            <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000", padding: "2px 8px", fontSize: 11, fontWeight: 800, borderRadius: 2 }}>
              SCHEDULE OPTIMIZED
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", marginTop: 12 }}>
            <div style={{ position: "relative", width: "100%", height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ backgroundColor: "#000000", color: "#ffffff", padding: "6px 10px", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700 }}>
                            {payload[0].name}: {payload[0].value} Hours
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={SCHEDULE_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveSlice(index)}
                    onMouseLeave={() => setActiveSlice(null)}
                  >
                    {SCHEDULE_PIE_DATA.map((entry, index) => (
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
                  23h
                </span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, fontWeight: 800, color: "#6b7280" }}>
                  TOTAL
                </span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SCHEDULE_PIE_DATA.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, backgroundColor: item.color, border: "1.5px solid #000", flexShrink: 0, borderRadius: 2 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                    <span style={{ color: "#374151" }}>{item.name}</span>
                    <span style={{ fontWeight: 800, color: "#000" }}>{item.value}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Restyled Quick Action Modules */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--color-dark, #231e25)", margin: 0, letterSpacing: 1 }}>
            ATTENDEE EXPERIENCES
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {attendeeLinks.map((item) => (
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
              }}
            >
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
                  ACTION
                </span>
              </div>

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
                  <span>LAUNCH MODULE</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;