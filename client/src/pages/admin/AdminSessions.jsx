import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";
import Loading from "../../components/Loading.jsx";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 6;

const AdminSessions = () => {
  const { id: expoId } = useParams();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", speaker: "", topic: "", location: "", startTime: "", endTime: "",
  });
  const [focused, setFocused] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expoRes, sessionsRes] = await Promise.all([
        api.get(`/expos/${expoId}`),
        api.get(`/expos/${expoId}/sessions`),
      ]);
      setExpo(expoRes.data);
      setSessions(sessionsRes.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load session data");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [expoId]);

  useEffect(() => {
    if (!socket) return;
    const handleScheduleUpdated = (data) => {
      if (data?.expoId === expoId || !data?.expoId) fetchData();
    };
    socket.on("schedule:updated", handleScheduleUpdated);
    return () => socket.off("schedule:updated", handleScheduleUpdated);
  }, [socket, expoId]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", speaker: "", topic: "", location: "", startTime: "", endTime: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formData.title.trim()) return setError("Session Title is required.");
    if (!formData.startTime) return setError("Start time is required.");
    if (!formData.endTime) return setError("End time is required.");
    if (new Date(formData.endTime) <= new Date(formData.startTime)) return setError("End time must be after start time.");

    try {
      if (editingId) {
        await api.put(`/sessions/${editingId}`, formData);
        setSuccess("Session updated successfully!");
      } else {
        await api.post("/sessions", { ...formData, expo: expoId });
        setSuccess("Session created successfully!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to save session");
    }
  };

  const handleEdit = (session) => {
    setEditingId(session._id);
    const formatDT = (dt) => (dt ? new Date(dt).toISOString().slice(0, 16) : "");
    setFormData({
      title: session.title || "", speaker: session.speaker || "",
      topic: session.topic || "", location: session.location || "",
      startTime: formatDT(session.startTime), endTime: formatDT(session.endTime),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setError(""); setSuccess("");
      try {
        await api.delete(`/sessions/${id}`);
        setSuccess("Session deleted successfully!");
        fetchData();
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to delete session");
      }
    }
  };

  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE) || 1;
  const currentSessions = sessions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const inputStyle = (name) => ({
    width: "100%", padding: "10px 12px",
    border: "2px solid var(--color-dark, #231e25)",
    borderRadius: 4, fontFamily: "'Satoshi', sans-serif",
    fontWeight: 600, fontSize: 14, marginTop: 4,
    background: "#fff", outline: "none", boxSizing: "border-box",
    boxShadow: focused === name ? "4px 4px 0 var(--color-purple-mimosa, #a67eff)" : "2px 2px 0 #000",
    transition: "box-shadow 0.2s ease",
  });
  const labelStyle = { fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--color-dark, #231e25)", display: "inline-flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["SCHEDULE MANAGER", `${sessions.length} SESSIONS`, "REAL-TIME SYNC", expo?.title || "EXPO"]} color="var(--color-purple-mimosa, #a67eff)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={`${sessions.length} SESSIONS`} size={90} bg="var(--color-purple-mimosa, #a67eff)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <Link to="/admin/expos" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, color: "var(--color-dark, #231e25)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1.5px solid #000", borderRadius: 3, background: "#fff", boxShadow: "2px 2px 0 #000", marginBottom: 12 }}>
            ← BACK TO EXPOS
          </Link>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
              <PulseDot color="#fff" size={6} glow={false} />
              [ SCHEDULE MANAGER ]
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
              EXPO SESSIONS — {expo?.title || "SCHEDULE"}
            </h1>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ background: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} /> Error: {error}
          </motion.div>
        )}
        {success && (
          <motion.div key="suc" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ background: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "4px 4px 0 var(--color-dark, #231e25)", padding: "12px 16px", color: "#000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
            <ShineSweep duration={1.6} delay={0.2} opacity={0.4} />
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#000", color: "var(--color-kiwi, #abf139)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, border: "2px solid #000", flexShrink: 0 }}>✓</span>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
        style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "26px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.3} opacity={0.2} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap", marginBottom: 18, position: "relative", zIndex: 2 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: editingId ? "var(--color-selective-yellow, #feb804)" : "var(--color-dark, #231e25)", color: editingId ? "#000" : "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 8, fontFamily: "'Satoshi', sans-serif" }}>
              <PulseDot color={editingId ? "#000" : "#fff"} size={6} glow={false} />
              {editingId ? "EDIT MODE" : "CREATE MODE"}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.6vw, 28px)", margin: 0, letterSpacing: 0.8 }}>
              {editingId ? "EDIT SESSION SCHEDULE" : "ADD SESSION / WORKSHOP"}
            </h3>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ background: "#e5e7eb", color: "#000", border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "8px 16px", fontFamily: "var(--font-display)", fontSize: 16, cursor: "pointer" }}>
              CANCEL EDIT
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, position: "relative", zIndex: 2 }}>
          <div>
            <label style={labelStyle}>Session Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} onFocus={() => setFocused("title")} onBlur={() => setFocused(null)} placeholder="Sustainable packaging trends" style={inputStyle("title")} />
          </div>
          <div>
            <label style={labelStyle}>Speaker Name</label>
            <input type="text" name="speaker" value={formData.speaker} onChange={handleChange} onFocus={() => setFocused("speaker")} onBlur={() => setFocused(null)} placeholder="Dr. Helena Vance" style={inputStyle("speaker")} />
          </div>
          <div>
            <label style={labelStyle}>Topic / Track</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange} onFocus={() => setFocused("topic")} onBlur={() => setFocused(null)} placeholder="Supply Chain Robotics" style={inputStyle("topic")} />
          </div>
          <div>
            <label style={labelStyle}>Auditorium / Room</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} onFocus={() => setFocused("loc")} onBlur={() => setFocused(null)} placeholder="Main Hall A" style={inputStyle("loc")} />
          </div>
          <div>
            <label style={labelStyle}>Start Date & Time *</label>
            <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} onFocus={() => setFocused("st")} onBlur={() => setFocused(null)} style={inputStyle("st")} />
          </div>
          <div>
            <label style={labelStyle}>End Date & Time *</label>
            <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} onFocus={() => setFocused("et")} onBlur={() => setFocused(null)} style={inputStyle("et")} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, marginTop: 6 }}>
            <motion.button type="submit" whileHover={{ y: -3, boxShadow: "6px 6px 0 #000" }} whileTap={{ y: 1, boxShadow: "2px 2px 0 #000" }}
              style={{ position: "relative", overflow: "hidden", background: editingId ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)", color: editingId ? "#000" : "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "12px 26px", fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <ShineSweep duration={1.4} delay={0} opacity={0.35} />
              <PulseDot color={editingId ? "#000" : "#fff"} size={7} glow={false} />
              {editingId ? "UPDATE SESSION" : "CREATE SESSION"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "24px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.18} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, position: "relative", zIndex: 2, flexWrap: "wrap" }}>
          <span style={{ width: 10, height: 10, background: "var(--color-purple-mimosa, #a67eff)", border: "1.5px solid #000", display: "inline-block" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.6vw, 28px)", margin: 0, letterSpacing: 0.8 }}>SCHEDULED SESSIONS</h3>
          <span style={{ background: "var(--color-dark, #231e25)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 14 }}>{sessions.length}</span>
        </div>

        {loading ? (
          <Loading message="Loading sessions..." />
        ) : sessions.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280" }}>No sessions scheduled for this expo.</div>
        ) : (
          <>
            <div style={{ overflowX: "auto", borderRadius: 4, border: "2px solid #000", boxShadow: "4px 4px 0 #000", position: "relative", zIndex: 2 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 13, minWidth: 820 }}>
                <thead>
                  <tr style={{ background: "var(--color-dark, #231e25)", color: "#fff", textAlign: "left" }}>
                    {["TITLE", "SPEAKER & TOPIC", "ROOM", "TIME SCHEDULE", "ACTIONS"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", borderRight: "1.5px solid #000", letterSpacing: 1, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentSessions.map((sess, idx) => (
                    <motion.tr key={sess._id}
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}
                      whileHover={{ background: "rgba(166,126,255,0.06)" }}
                      style={{ borderBottom: idx < currentSessions.length - 1 ? "1.5px solid #000" : "none" }}>
                      <td style={{ padding: "14px", borderRight: "1.5px solid #000" }}>
                        <strong style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.3 }}>{sess.title}</strong>
                      </td>
                      <td style={{ padding: "14px", borderRight: "1.5px solid #000" }}>
                        <strong>{sess.speaker || "N/A"}</strong>
                        {sess.topic && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <PulseDot color="var(--color-purple-mimosa, #a67eff)" size={5} glow={false} /> {sess.topic}
                        </div>}
                      </td>
                      <td style={{ padding: "14px", borderRight: "1.5px solid #000", fontWeight: 700 }}>
                        <span style={{ background: "#f9fafb", border: "1.5px solid #000", padding: "3px 8px", borderRadius: 3, fontSize: 11.5, fontWeight: 800 }}>
                          📍 {sess.location || "TBA"}
                        </span>
                      </td>
                      <td style={{ padding: "14px", borderRight: "1.5px solid #000", fontWeight: 600, color: "#4b5563" }}>
                        🕐 {new Date(sess.startTime).toLocaleString()}<br />
                        <span style={{ color: "#9ca3af" }}>→</span> {new Date(sess.endTime).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleEdit(sess)}
                            style={{ background: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, cursor: "pointer", fontSize: 11.5, fontWeight: 800 }}>
                            EDIT
                          </motion.button>
                          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleDelete(sess._id)}
                            style={{ background: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, cursor: "pointer", fontSize: 11.5, fontWeight: 800 }}>
                            DELETE
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    backgroundColor: currentPage === 1 ? "#e5e7eb" : "var(--color-dark, #231e25)",
                    color: currentPage === 1 ? "#9ca3af" : "#fff",
                    border: "2px solid #000",
                    padding: "6px 14px",
                    borderRadius: 4,
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ← PREV
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    style={{
                      minWidth: 36,
                      height: 36,
                      backgroundColor: currentPage === num ? "var(--color-purple-mimosa, #a67eff)" : "#ffffff",
                      color: currentPage === num ? "#ffffff" : "#231e25",
                      border: "2px solid #000",
                      boxShadow: currentPage === num ? "2px 2px 0 #000" : "none",
                      borderRadius: 4,
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    backgroundColor: currentPage === totalPages ? "#e5e7eb" : "var(--color-dark, #231e25)",
                    color: currentPage === totalPages ? "#9ca3af" : "#fff",
                    border: "2px solid #000",
                    padding: "6px 14px",
                    borderRadius: 4,
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  NEXT →
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminSessions;