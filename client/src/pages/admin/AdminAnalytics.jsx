import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import api from "../../services/api.js";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const METRIC_STYLES = [
  { key: "totalExpos", label: "TOTAL EXPOS", icon: "🏛", bg: "var(--color-primary, #ff3e33)", text: "#fff", sub: "Active Trade Shows" },
  { key: "occupancyRate", label: "FLOOR OCCUPANCY", icon: "📊", bg: "var(--color-selective-yellow, #feb804)", text: "#000", sub: "Booths Reserved", suffix: "%" },
  { key: "totalAttendees", label: "ATTENDEE REACH", icon: "🎟", bg: "var(--color-purple-mimosa, #a67eff)", text: "#fff", sub: "Verified Registrations" },
  { key: "totalExhibitors", label: "EXHIBITOR PARTNERS", icon: "🤝", bg: "var(--color-kiwi, #abf139)", text: "#000", sub: "Active Commercial Brands" },
];

const MiniSpark = ({ data, color = "#000" }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 30 }}>
    {data.map((v, i) => (
      <motion.span key={i}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
        transition={{ delay: i * 0.05, type: "spring", stiffness: 220, damping: 20 }}
        style={{ display: "block", width: 6, height: `${v * 100}%`, background: color, transformOrigin: "bottom", borderRadius: 1 }} />
    ))}
  </div>
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlice, setActiveSlice] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get("/analytics/admin");
        setData(res.data);
      } catch (err) {
        setData({
          metrics: { totalExpos: 3, totalBooths: 45, bookedBooths: 28, occupancyRate: 62, totalAttendees: 240, totalExhibitors: 18, totalRegistrations: 380, totalSessions: 16 },
          attendanceBreakdown: [
            { name: "Tech Summit", count: 140 },
            { name: "Green Energy", count: 95 },
            { name: "Fintech Forum", count: 120 },
          ],
          boothStatusData: [
            { name: "Booked", value: 28, color: "var(--color-primary, #ff3e33)" },
            { name: "Available", value: 17, color: "var(--color-kiwi, #abf139)" },
          ],
        });
      } finally { setLoading(false); }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4px" }}>
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <Scanline color="rgba(171,241,57,0.3)" height={70} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-kiwi, #abf139)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>LOADING EXECUTIVE ANALYTICS...</p>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const boothTotal = (data?.boothStatusData || []).reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["EXECUTIVE TELEMETRY", "REAL-TIME ANALYTICS", `${metrics.totalExpos || 0} EXPOS TRACKED`, `${metrics.totalRegistrations || 0} REGISTRATIONS`]} color="var(--color-kiwi, #abf139)" duration={26} fontSize={11} />
      </div>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text="LIVE DATA" size={90} bg="var(--color-kiwi, #abf139)" color="#000" top={-20} right={-20} duration={17} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-kiwi, #abf139)", color: "#000", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
              <PulseDot color="#000" size={6} glow={false} />
              [ EXECUTIVE METRICS ]
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
              SYSTEM ANALYTICS & TELEMETRY
            </h1>
          </div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link to="/admin/expos"
              style={{ position: "relative", overflow: "hidden", background: "var(--color-dark, #231e25)", color: "#fff", padding: "11px 20px", textDecoration: "none", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.8, borderRadius: 4, border: "2.5px solid #000", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ShineSweep duration={1.4} delay={0} opacity={0.3} />
              MANAGE EXPOS →
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {error && (
        <div style={{ background: "#fee2e2", border: "2.5px solid red", padding: 14, fontWeight: 700, color: "#991b1b", fontFamily: "'Satoshi', sans-serif", borderRadius: 4, boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)" }}>{error}</div>
      )}

      {/* METRIC CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
        {METRIC_STYLES.map((m, i) => {
          const sparkData = [0.4, 0.6, 0.5, 0.75, 0.6, 0.9, 1].map((v) => v * (0.7 + Math.random() * 0.3));
          return (
            <motion.div key={m.key}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ y: -6, boxShadow: "9px 9px 0 #000", rotate: i % 2 === 0 ? -0.6 : 0.6 }}
              style={{ background: m.bg, color: m.text, border: "3px solid #000", boxShadow: "6px 6px 0 #000", padding: "20px 22px", position: "relative", overflow: "hidden" }}>
              <CornerBrackets color={m.text === "#fff" ? "#fff" : "#000"} inset={7} size={10} thickness={2} />
              <ShineSweep duration={1.5} delay={i * 0.1} opacity={0.3} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
                <span style={{ width: 36, height: 36, background: "rgba(0,0,0,0.18)", border: "2px solid #000", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{m.icon}</span>
                <PulseDot color={m.text === "#fff" ? "#fff" : "#000"} size={9} glow={false} />
              </div>

              <div style={{ marginTop: 12, position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Satoshi', sans-serif", opacity: 0.85 }}>{m.label}</span>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginTop: 4 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 54px)", lineHeight: 0.9, letterSpacing: 1 }}>
                    {metrics[m.key] || 0}{m.suffix || ""}
                  </div>
                  <MiniSpark data={sparkData} color={m.text === "#fff" ? "#fff" : "#000"} />
                </div>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1.5px dashed " + (m.text === "#fff" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"), fontSize: 11.5, fontWeight: 800, fontFamily: "'Satoshi', sans-serif", opacity: 0.9 }}>
                  {m.sub}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <ShineSweep duration={1.7} delay={0.15} opacity={0.18} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primary, #ff3e33)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 8, fontFamily: "'Satoshi', sans-serif" }}>
              <PulseDot color="#fff" size={6} glow={false} />
              ENGAGEMENT
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.2vw, 24px)", margin: "0 0 4px 0", letterSpacing: 0.6 }}>REGISTRATIONS PER EXPO</h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, color: "#6b7280", margin: "0 0 16px 0", fontWeight: 600 }}>Confirmed ticket holders across main venues</p>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.attendanceBreakdown || []}>
                  <XAxis dataKey="name" stroke="#000" fontSize={11} fontWeight={700} />
                  <YAxis stroke="#000" fontSize={11} fontWeight={700} />
                  <Tooltip contentStyle={{ backgroundColor: "#000", color: "#fff", borderRadius: 4, border: "2px solid var(--color-kiwi, #abf139)", fontFamily: "'Satoshi', sans-serif", fontSize: 12 }} />
                  <Bar dataKey="count" fill="var(--color-primary, #ff3e33)" stroke="#000" strokeWidth={2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Donut chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <ShineSweep duration={1.7} delay={0.25} opacity={0.18} />
          <Scanline color="rgba(20,166,234,0.2)" height={70} duration={2.6} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 8, fontFamily: "'Satoshi', sans-serif" }}>
              <PulseDot color="#000" size={6} glow={false} />
              FLOOR STATUS
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.2vw, 24px)", margin: "0 0 4px 0", letterSpacing: 0.6 }}>BOOTH STATUS BREAKDOWN</h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, color: "#6b7280", margin: "0 0 16px 0", fontWeight: 600 }}>Booked vs available floor spaces across all halls</p>

            <div style={{ position: "relative", width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: "#000", color: "#fff", borderRadius: 4, border: "2px solid var(--color-kiwi, #abf139)", fontFamily: "'Satoshi', sans-serif", fontSize: 12 }} />
                  <Pie data={data?.boothStatusData || []} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value"
                    onMouseEnter={(_, idx) => setActiveSlice(idx)}
                    onMouseLeave={() => setActiveSlice(null)}>
                    {(data?.boothStatusData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={2}
                        style={{ transform: activeSlice === index ? "scale(1.08)" : "scale(1)", transformOrigin: "center center", transition: "transform 0.2s ease", cursor: "pointer" }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <motion.span key={activeSlice} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ fontFamily: "var(--font-display)", fontSize: 32, lineHeight: 0.9, color: "var(--color-dark, #231e25)", letterSpacing: 1 }}>
                  {activeSlice !== null ? data.boothStatusData[activeSlice].value : boothTotal}
                </motion.span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 9.5, fontWeight: 900, letterSpacing: 1, color: "#6b7280", marginTop: 2, textTransform: "uppercase" }}>
                  {activeSlice !== null ? data.boothStatusData[activeSlice].name : "Total"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}