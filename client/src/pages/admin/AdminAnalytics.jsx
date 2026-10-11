import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/analytics/admin");
      setData(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <Loading message="Loading executive analytics..." />;
  if (error) return <div style={{ backgroundColor: "#fee2e2", border: "2px solid red", padding: 16 }}>{error}</div>;
  if (!data) return <div style={{ padding: 24, textAlign: "center" }}>No analytics data available</div>;

  const {
    totals,
    boothsByStatus,
    applicationsByStatus,
    registrationsPerExpo,
    topSessions,
    occupancyPerExpo,
  } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ EXECUTIVE INTELLIGENCE ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          SYSTEM ANALYTICS & EXPO PERFORMANCE
        </h1>
      </div>

      {/* KPI Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {[
          { label: "TOTAL USERS", val: totals.users, sub: `${totals.exhibitors} Exhibitors · ${totals.attendees} Attendees`, bg: "var(--color-light, #fff8eb)" },
          { label: "TOTAL EXPOS", val: totals.expos, sub: "Across all halls", bg: "var(--color-selective-yellow, #feb804)" },
          { label: "SCHEDULED SESSIONS", val: totals.sessions, sub: "Keynotes & Workshops", bg: "var(--color-kiwi, #abf139)" },
          { label: "APPLICATIONS", val: totals.applications, sub: "Submitted Booth Requests", bg: "var(--color-purple-mimosa, #a67eff)", text: "#fff" },
          { label: "USER FEEDBACK", val: totals.feedback, sub: "Suggestions & Issues", bg: "var(--color-cerulean, #14a6ea)", text: "#fff" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: item.bg,
              color: item.text || "var(--color-dark, #231e25)",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, opacity: 0.8 }}>{item.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1, margin: "6px 0" }}>{item.val}</div>
            <div style={{ fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24 }}>
        {/* Chart 1: Applications Donut */}
        <div style={{ backgroundColor: "#fff", border: "2.5px solid #000", boxShadow: "5px 5px 0px #000", padding: "20px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 12px 0" }}>APPLICATIONS BY STATUS</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={applicationsByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                  {applicationsByStatus.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.name === "Approved" ? "var(--color-kiwi, #abf139)" : entry.name === "Rejected" ? "var(--color-primary, #ff3e33)" : "var(--color-selective-yellow, #feb804)"}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Registrations Bar */}
        <div style={{ backgroundColor: "#fff", border: "2.5px solid #000", boxShadow: "5px 5px 0px #000", padding: "20px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 12px 0" }}>ATTENDEE REGISTRATIONS PER EXPO</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationsPerExpo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="expoTitle" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary, #ff3e33)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;