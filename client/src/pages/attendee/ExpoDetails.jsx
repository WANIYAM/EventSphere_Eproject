import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  Scanline,
  GrainOverlay,
  TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const BASE = "http://localhost:5000";

const TABS = [
  { id: "schedule", label: "SCHEDULE & SESSIONS", accent: "var(--color-primary, #ff3e33)" },
  { id: "exhibitors", label: "EXHIBITORS DIRECTORY", accent: "var(--color-purple-mimosa, #a67eff)" },
  { id: "floorplan", label: "INTERACTIVE FLOOR PLAN", accent: "var(--color-kiwi, #abf139)" },
  { id: "about", label: "EXPO MANIFESTO", accent: "var(--color-cerulean, #14a6ea)" },
];

const ExpoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [tab, setTab] = useState("schedule");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [sessions, setSessions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [booths, setBooths] = useState([]);

  const [pendingActions, setPendingActions] = useState({});

  const setItemPending = (key, isPending) => {
    setPendingActions((prev) => ({ ...prev, [key]: isPending }));
  };
  const isPending = (key) => Boolean(pendingActions[key]);

  useEffect(() => {
    const fetchExpo = async () => {
      try {
        const res = await api.get(`/expos/${id}`);
        setExpo(res.data);
      } catch (err) {
        setError(err.userMessage || "Failed to load expo details");
      } finally {
        setLoading(false);
      }
    };
    fetchExpo();
    fetchRegistrations();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleBoothUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) fetchBooths();
    };
    const handleScheduleUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) fetchSessions();
    };
    socket.on("booth:updated", handleBoothUpdated);
    socket.on("schedule:updated", handleScheduleUpdated);
    return () => {
      socket.off("booth:updated", handleBoothUpdated);
      socket.off("schedule:updated", handleScheduleUpdated);
    };
  }, [socket, id]);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (tab === "schedule") fetchSessions();
    if (tab === "exhibitors") { fetchExhibitors(); fetchCategories(); }
    if (tab === "floorplan") fetchBooths();
  }, [tab, id]);

  const fetchSessions = async () => {
    try { const res = await api.get(`/expos/${id}/sessions`); setSessions(res.data || []); }
    catch (err) { console.error(err); }
  };
  const fetchExhibitors = async () => {
    try {
      const params = { expo: id };
      if (searchTerm) params.search = searchTerm;
      if (catFilter) params.category = catFilter;
      const res = await api.get("/exhibitors", { params });
      setExhibitors(res.data || []);
    } catch (err) { console.error(err); }
  };
  const fetchCategories = async () => {
    try { const res = await api.get("/exhibitors/categories"); setCategories(res.data || []); }
    catch (err) { console.error(err); }
  };
  const fetchBooths = async () => {
    try { const res = await api.get(`/expos/${id}/booths`); setBooths(res.data || []); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { if (tab === "exhibitors") fetchExhibitors(); }, [searchTerm, catFilter]);

  const isExpoRegistered = registrations.some(
    (r) => r.type === "expo" && (r.expo?._id === id || r.expo === id) && r.registered
  );
  const getSessionReg = (sessionId) =>
    registrations.find((r) => r.type === "session" && (r.session?._id === sessionId || r.session === sessionId));
  const isExpoEnded = Boolean(expo?.endDate && new Date(expo.endDate) < new Date());

  const handleRegisterExpo = async () => {
    if (isExpoEnded || isPending("expo")) return;
    setError(""); setSuccess("");
    setItemPending("expo", true);
    try {
      await api.post("/registrations", { expo: id });
      setSuccess("Successfully registered for this Expo!");
      await fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Registration failed");
    } finally { setItemPending("expo", false); }
  };

  const handleRegisterSession = async (sessionId) => {
    if (isPending(`sess-${sessionId}`)) return;
    setError(""); setSuccess("");
    setItemPending(`sess-${sessionId}`, true);
    try {
      const res = await api.post("/registrations/session", { session: sessionId });
      setSuccess(res.data?.warning ? `Registered for session! (Warning: ${res.data.warning})` : "Registered for session!");
      await fetchRegistrations();
    } catch (err) { setError(err.userMessage || err.response?.data?.message || "Failed"); }
    finally { setItemPending(`sess-${sessionId}`, false); }
  };

  const handleCancelSession = async (sessionId, regId) => {
    if (isPending(`sess-${sessionId}`)) return;
    setError(""); setSuccess("");
    setItemPending(`sess-${sessionId}`, true);
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess("Session registration cancelled");
      await fetchRegistrations();
    } catch (err) { setError(err.userMessage || err.response?.data?.message || "Failed"); }
    finally { setItemPending(`sess-${sessionId}`, false); }
  };

  const handleBookmark = async (sessionId) => {
    if (isPending(`bm-${sessionId}`)) return;
    setError("");
    setItemPending(`bm-${sessionId}`, true);
    try {
      await api.put("/registrations/bookmark", { session: sessionId });
      await fetchRegistrations();
    } catch (err) { setError(err.userMessage || err.response?.data?.message || "Failed"); }
    finally { setItemPending(`bm-${sessionId}`, false); }
  };

  const groupByDay = (sessionsList) => {
    const groups = {};
    sessionsList.forEach((s) => {
      const day = new Date(s.startTime).toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      if (!groups[day]) groups[day] = [];
      groups[day].push(s);
    });
    return groups;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ backgroundColor: "#ffffff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 #231e25", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <Scanline color="rgba(255,62,51,0.3)" height={70} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-primary, #ff3e33)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>SYNCHRONIZING EXPO SPECIFICATION...</p>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }
  if (!expo) {
    return (
      <div style={{ maxWidth: 640, margin: "20px auto", backgroundColor: "var(--color-selective-yellow, #feb804)", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 40, position: "relative" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 34, margin: "0 0 8px 0" }}>EXPO NOT FOUND</h3>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>The requested expo could not be located.</p>
        <Link to="/expos" style={{ display: "inline-block", marginTop: 12, background: "#000", color: "#fff", padding: "10px 20px", textDecoration: "none", fontFamily: "var(--font-display)", fontSize: 18 }}>BACK TO EXPOS</Link>
      </div>
    );
  }

  const dayGroups = groupByDay(sessions);
  const bookedBooths = booths.filter((b) => b.status === "booked" || b.status === "reserved").length;
  const availableBooths = booths.filter((b) => b.status === "available").length;

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Ticker */}
      <div style={{ backgroundColor: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["EXPO SPECIFICATION LIVE", `SESSIONS · ${sessions.length}`, `EXHIBITORS · ${exhibitors.length}`, `BOOTHS · ${booths.length}`]} color="var(--color-primary, #ff3e33)" duration={26} fontSize={11} />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />

        <RotatingBadge text={isExpoEnded ? "ENDED" : "LIVE EXPO"} size={88} bg={isExpoEnded ? "#9ca3af" : "var(--color-kiwi, #abf139)"} color="#000" top={-20} right={-20} duration={16} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <Link to="/expos" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, color: "var(--color-dark, #231e25)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10, padding: "4px 10px", border: "1.5px solid #000", borderRadius: 3, background: "#fff", boxShadow: "2px 2px 0 #000" }}>
            ← BACK TO ALL EXPOS
          </Link>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--color-dark, #231e25)", color: "var(--color-light, #fff8eb)", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.6, border: "1.5px solid #000" }}>
              <PulseDot color="var(--color-primary, #ff3e33)" size={6} glow={false} />
              [ EXPO SPECIFICATION ]
            </span>
            {expo.theme && (
              <span style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
                ◆ {expo.theme}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: "clamp(34px, 4.2vw, 52px)", color: "var(--color-dark, #231e25)", lineHeight: 0.92, margin: "4px 0 8px 0", letterSpacing: 1 }}>
            {expo.title}
          </h1>

          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#4b5563" }}>
            <span>🗓 {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</span>
            <span>📍 {expo.location || "Convention Hall"}</span>
            <span>◆ {availableBooths} booths open</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {isExpoEnded ? (
            <span style={{ backgroundColor: "#fee2e2", color: "#991b1b", border: "2px solid #991b1b", padding: "8px 18px", borderRadius: 4, fontSize: 13, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <PulseDot color="#991b1b" size={7} glow={false} /> EXPO ENDED
            </span>
          ) : isExpoRegistered ? (
            <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "10px 22px", borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, display: "inline-flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
              <ShineSweep duration={1.4} delay={0} opacity={0.4} />
              <PulseDot color="#000" glow={false} size={8} />
              REGISTRATION CONFIRMED
            </div>
          ) : (
            <motion.button
              onClick={handleRegisterExpo}
              disabled={isPending("expo")}
              whileHover={isPending("expo") ? {} : { scale: 1.04, y: -3, boxShadow: "7px 7px 0 #000" }}
              whileTap={isPending("expo") ? {} : { scale: 0.96 }}
              style={{
                position: "relative", overflow: "hidden",
                backgroundColor: isPending("expo") ? "#9ca3af" : "var(--color-primary, #ff3e33)",
                color: "#fff",
                border: "2.5px solid #000",
                boxShadow: "4px 4px 0px #000",
                padding: "12px 26px",
                borderRadius: 4,
                fontFamily: "var(--font-display)",
                fontSize: 20,
                letterSpacing: 1,
                cursor: isPending("expo") ? "not-allowed" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}
            >
              {!isPending("expo") && <ShineSweep duration={1.4} delay={0} opacity={0.35} />}
              {isPending("expo") && <PulseDot color="#fff" size={8} glow={false} />}
              {isPending("expo") ? "REGISTERING..." : "REGISTER FOR THIS EXPO"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* STATUS BANNERS */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} /> Error: {error}
          </motion.div>
        )}
        {success && (
          <motion.div key="suc" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "4px 4px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
            <ShineSweep duration={1.6} delay={0.2} opacity={0.4} />
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#000", color: "var(--color-kiwi, #abf139)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, border: "2px solid #000", flexShrink: 0 }}>✓</span>
            Success: {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABS */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              whileHover={{ y: -2, rotate: isActive ? 0 : -0.6 }}
              whileTap={{ y: 1 }}
              style={{
                position: "relative", overflow: "hidden",
                padding: "10px 20px",
                borderRadius: 4,
                backgroundColor: isActive ? "var(--color-dark, #231e25)" : "var(--color-light, #fff8eb)",
                color: isActive ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                border: "2px solid var(--color-dark, #231e25)",
                boxShadow: isActive ? `4px 4px 0px ${t.accent}` : "2px 2px 0px var(--color-dark, #231e25)",
                fontFamily: "var(--font-display)",
                fontSize: 17,
                letterSpacing: 0.5,
                cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              {isActive && <ShineSweep duration={1.4} delay={0} opacity={0.3} />}
              {isActive && <PulseDot color={t.accent} size={7} glow={false} />}
              {t.label}
            </motion.button>
          );
        })}
      </div>

      {/* ═══════════════ TAB 1 — SCHEDULE ═══════════════ */}
      {tab === "schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {sessions.length === 0 ? (
            <div style={{ backgroundColor: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: 36, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, position: "relative", overflow: "hidden" }}>
              <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
              No sessions scheduled for this expo yet.
            </div>
          ) : (
            Object.entries(dayGroups).map(([day, daySessions], gi) => (
              <motion.div key={day} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: gi * 0.08 }}
                style={{ backgroundColor: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "22px 26px", position: "relative", overflow: "hidden" }}>
                <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
                <ShineSweep duration={1.6} delay={0.1 + gi * 0.05} opacity={0.2} />

                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "var(--color-dark, #231e25)", color: "var(--color-light, #fff8eb)", padding: "6px 14px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, marginBottom: 16, position: "relative", zIndex: 2 }}>
                  <PulseDot color="var(--color-primary, #ff3e33)" size={7} glow={false} />
                  {day.toUpperCase()}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {daySessions.map((s) => {
                    const reg = getSessionReg(s._id);
                    const isReg = reg?.registered;
                    const isBookmarked = reg?.bookmarked;
                    const isSessionEnded = Boolean(s.endTime && new Date(s.endTime) < new Date());
                    const isSessPending = isPending(`sess-${s._id}`);
                    const isBmPending = isPending(`bm-${s._id}`);

                    return (
                      <motion.div key={s._id} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        style={{
                          backgroundColor: "var(--color-light, #fff8eb)",
                          border: "2px solid var(--color-dark, #231e25)",
                          borderLeft: isReg ? "6px solid var(--color-kiwi, #abf139)" : isBookmarked ? "6px solid var(--color-selective-yellow, #feb804)" : "2px solid var(--color-dark, #231e25)",
                          boxShadow: "3px 3px 0 var(--color-dark, #231e25)",
                          padding: "14px 18px",
                          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
                          position: "relative", overflow: "hidden",
                        }}>
                        <ShineSweep duration={1.6} delay={0.2} opacity={0.2} />

                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 620, position: "relative", zIndex: 2 }}>
                          <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 800, margin: 0, color: "var(--color-dark, #231e25)" }}>{s.title}</h4>
                          {s.speaker && (
                            <span style={{ fontSize: 12.5, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-primary, #ff3e33)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <PulseDot color="var(--color-primary, #ff3e33)" size={6} glow={false} />
                              {s.speaker} {s.topic && `(${s.topic})`}
                            </span>
                          )}
                          <span style={{ fontSize: 11.5, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", fontWeight: 700 }}>
                            🕐 {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · 📍 {s.location || "Main Stage"}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 2, flexWrap: "wrap" }}>
                          {isSessionEnded ? (
                            <span style={{ backgroundColor: "#fee2e2", color: "#991b1b", border: "1.5px solid #991b1b", padding: "5px 12px", borderRadius: 3, fontSize: 11.5, fontWeight: 800 }}>Ended</span>
                          ) : (
                            <>
                              {isReg ? (
                                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleCancelSession(s._id, reg._id)} disabled={isSessPending}
                                  style={{ position: "relative", overflow: "hidden", backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "6px 14px", borderRadius: 3, cursor: isSessPending ? "not-allowed" : "pointer", fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, fontWeight: 800, opacity: isSessPending ? 0.6 : 1 }}>
                                  {isSessPending && <PulseDot color="#fff" size={6} glow={false} />}
                                  {isSessPending ? "Cancelling..." : "Cancel Registration"}
                                </motion.button>
                              ) : (
                                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleRegisterSession(s._id)} disabled={isSessPending}
                                  style={{ position: "relative", overflow: "hidden", backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "6px 14px", borderRadius: 3, cursor: isSessPending ? "not-allowed" : "pointer", fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, fontWeight: 800, opacity: isSessPending ? 0.6 : 1 }}>
                                  {isSessPending && <PulseDot color="#000" size={6} glow={false} />}
                                  {isSessPending ? "Registering..." : "+ Register"}
                                </motion.button>
                              )}

                              <motion.button whileHover={{ y: -2, rotate: isBookmarked ? -2 : 2 }} whileTap={{ scale: 0.96 }} onClick={() => handleBookmark(s._id)} disabled={isBmPending}
                                style={{
                                  position: "relative", overflow: "hidden",
                                  backgroundColor: isBookmarked ? "var(--color-selective-yellow, #feb804)" : "#fff",
                                  color: "#000",
                                  border: "1.5px solid #000",
                                  boxShadow: "2px 2px 0 #000",
                                  padding: "6px 12px",
                                  borderRadius: 3,
                                  cursor: isBmPending ? "not-allowed" : "pointer",
                                  fontSize: 11.5, fontWeight: 900,
                                  opacity: isBmPending ? 0.6 : 1,
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                }}>
                                {isBmPending ? <PulseDot color="#000" size={6} glow={false} /> : <span>{isBookmarked ? "★" : "☆"}</span>}
                                {isBmPending ? "Saving..." : (isBookmarked ? "Bookmarked" : "Bookmark")}
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ═══════════════ TAB 2 — EXHIBITORS ═══════════════ */}
      {tab === "exhibitors" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ backgroundColor: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "5px 5px 0 var(--color-dark, #231e25)", padding: "16px 20px", display: "flex", gap: 12, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
            <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
            <ShineSweep duration={1.5} delay={0.2} opacity={0.2} />

            <input
              type="text"
              placeholder="Search exhibitors by company or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: "1 1 240px", padding: "10px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 600, outline: "none", backgroundColor: "#fff", boxShadow: "2px 2px 0 #000", position: "relative", zIndex: 2 }}
            />

            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              style={{ padding: "10px 16px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, backgroundColor: "#fff", boxShadow: "2px 2px 0 #000", position: "relative", zIndex: 2 }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </motion.div>

          {exhibitors.length === 0 ? (
            <div style={{ backgroundColor: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: 36, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>No exhibitors match your search criteria.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {exhibitors.map((ex, idx) => (
                <motion.div key={ex._id}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06, duration: 0.4 }}
                  whileHover={{ y: -6, boxShadow: "8px 8px 0 var(--color-dark, #231e25)", rotate: -0.4 }}
                  style={{ backgroundColor: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "4px 4px 0 var(--color-dark, #231e25)", padding: 20, display: "flex", gap: 14, alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                  <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
                  <ShineSweep duration={1.6} delay={idx * 0.05} opacity={0.2} />

                  <div style={{ width: 66, height: 66, borderRadius: 6, border: "2.5px solid #000", backgroundColor: "var(--color-light, #fff8eb)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 #000", position: "relative", zIndex: 2 }}>
                    {ex.logo ? (
                      <img src={`${BASE}${ex.logo}`} alt={ex.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 900, fontFamily: "var(--font-display)" }}>EXPO</span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0, position: "relative", zIndex: 2 }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, margin: 0, color: "var(--color-dark, #231e25)", letterSpacing: 0.5 }}>{ex.company || ex.name}</h4>
                    {ex.category && (
                      <span style={{ width: "fit-content", backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 800, border: "1.5px solid #000", letterSpacing: 0.4 }}>
                        {ex.category}
                      </span>
                    )}
                    {ex.booths?.length > 0 && (
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, fontWeight: 800, color: "var(--color-primary, #ff3e33)", margin: "4px 0 0 0", display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <PulseDot color="var(--color-primary, #ff3e33)" size={6} glow={false} />
                        BOOTH {ex.booths.join(", ")}
                      </p>
                    )}
                    <motion.div whileHover={{ x: 3 }}>
                      <Link to={`/exhibitors/${ex._id}`} style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12.5, fontWeight: 800, color: "var(--color-dark, #231e25)", textDecoration: "none", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        View Booth & Products →
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ TAB 3 — FLOOR PLAN ═══════════════ */}
      {tab === "floorplan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ backgroundColor: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "5px 5px 0 var(--color-dark, #231e25)", padding: "14px 20px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", position: "relative", overflow: "hidden" }}>
            <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: 0.6 }}>BOOTH STATUS:</span>
            {[
              { c: "var(--color-kiwi, #abf139)", l: `AVAILABLE (${availableBooths})` },
              { c: "var(--color-selective-yellow, #feb804)", l: "RESERVED" },
              { c: "var(--color-primary, #ff3e33)", l: `BOOKED (${bookedBooths})` },
            ].map(({ c, l }) => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, fontFamily: "'Satoshi', sans-serif", letterSpacing: 0.4 }}>
                <span style={{ width: 13, height: 13, backgroundColor: c, border: "1.5px solid #000", display: "inline-block", borderRadius: 2 }} /> {l}
              </span>
            ))}
          </div>

          <div style={{ backgroundColor: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "22px", position: "relative", overflow: "hidden" }}>
            <CornerBrackets color="#000" inset={8} size={11} thickness={2} />
            <ShineSweep duration={1.8} delay={0.2} opacity={0.15} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14, position: "relative", zIndex: 2 }}>
              {booths.map((b, idx) => {
                const bg = b.status === "available" ? "var(--color-kiwi, #abf139)" : b.status === "reserved" ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)";
                const text = b.status === "booked" ? "#fff" : "#000";
                const isClickable = b.status === "booked" && b.exhibitor?._id;

                return (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.02, type: "spring", stiffness: 320, damping: 22 }}
                    whileHover={isClickable ? { scale: 1.06, y: -3, boxShadow: "5px 5px 0 #000" } : { scale: 1.03, y: -2 }}
                    onClick={() => isClickable && navigate(`/exhibitors/${b.exhibitor._id}`)}
                    style={{
                      backgroundColor: bg,
                      color: text,
                      border: "2px solid var(--color-dark, #231e25)",
                      boxShadow: "3px 3px 0 var(--color-dark, #231e25)",
                      padding: "12px 8px",
                      borderRadius: 4,
                      textAlign: "center",
                      cursor: isClickable ? "pointer" : "default",
                      display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 4,
                      minHeight: 82,
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    {b.status === "available" && <ShineSweep duration={1.6} delay={idx * 0.03} opacity={0.35} />}
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1 }}>{b.boothNumber}</div>
                    {isClickable && b.exhibitor?.company && (
                      <div style={{ fontSize: 9.5, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: 0.4 }}>
                        {b.exhibitor.company}
                      </div>
                    )}
                    {b.status !== "available" && (
                      <div style={{ fontSize: 9, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, opacity: 0.85 }}>
                        {b.status}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 4 — ABOUT ═══════════════ */}
      {tab === "about" && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ backgroundColor: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "30px", position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
          <ShineSweep duration={1.8} delay={0.2} opacity={0.2} />
          <TickStrip color="rgba(0,0,0,0.3)" gap={14} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800, marginBottom: 14, border: "1.5px solid #000", letterSpacing: 0.8 }}>
            <PulseDot color="#fff" size={6} glow={false} />
            04 // EXPO MANIFESTO
          </div>

          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.2vw, 34px)", margin: "0 0 14px 0", letterSpacing: 1 }}>EXPO SCOPE & GUIDELINES</h3>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15.5, lineHeight: 1.65, color: "#374151", margin: 0 }}>
            {expo.description || "No description provided."}
          </p>

          <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 20, marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, fontFamily: "'Satoshi', sans-serif", fontSize: 13.5 }}>
            {[
              { l: "Venue", v: expo.location || "TBA" },
              { l: "Dates", v: `${new Date(expo.startDate).toLocaleDateString()} – ${new Date(expo.endDate).toLocaleDateString()}` },
              expo.theme ? { l: "Theme", v: expo.theme } : null,
            ].filter(Boolean).map((row) => (
              <div key={row.l} style={{ backgroundColor: "#f9fafb", border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "10px 14px", borderRadius: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>{row.l}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--color-dark, #231e25)" }}>{row.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExpoDetails;