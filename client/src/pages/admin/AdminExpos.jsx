import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";
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

const AdminExpos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", theme: "", location: "",
    image: "", imageFile: null, startDate: "", endDate: "",
    boothCount: 20, boothPrice: 500, boothSize: "3x3 m",
  });
  const [focused, setFocused] = useState(null);

  const fetchExpos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expos");
      setExpos(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load expos");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchExpos(); }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "", description: "", theme: "", location: "",
      image: "", imageFile: null, startDate: "", endDate: "",
      boothCount: 20, boothPrice: 500, boothSize: "3x3 m",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formData.title.trim()) return setError("Expo Title is required.");
    if (!formData.startDate) return setError("Start date is required.");
    if (!formData.endDate) return setError("End date is required.");
    if (new Date(formData.endDate) < new Date(formData.startDate)) return setError("End date cannot be before start date.");

    try {
      const { imageFile, ...expoData } = formData;
      let submissionData = expoData;
      if (imageFile) {
        submissionData = new FormData();
        Object.entries(expoData).forEach(([key, value]) => submissionData.append(key, String(value)));
        submissionData.append("image", imageFile);
      }
      if (editingId) {
        await api.put(`/expos/${editingId}`, submissionData, imageFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
        setSuccess("Expo updated successfully!");
      } else {
        await api.post("/expos", submissionData, imageFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
        setSuccess("Expo and interactive booths created successfully!");
      }
      resetForm();
      fetchExpos();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (expo) => {
    setEditingId(expo._id);
    setFormData({
      title: expo.title || "",
      description: expo.description || "",
      theme: expo.theme || "",
      location: expo.location || "",
      image: expo.image || "",
      imageFile: null,
      startDate: expo.startDate ? expo.startDate.split("T")[0] : "",
      endDate: expo.endDate ? expo.endDate.split("T")[0] : "",
      boothCount: 20, boothPrice: 500, boothSize: "3x3 m",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo? All related booths and applications will be deleted!")) {
      setError(""); setSuccess("");
      try {
        await api.delete(`/expos/${id}`);
        setSuccess("Expo deleted successfully!");
        fetchExpos();
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to delete expo");
      }
    }
  };

  const inputStyle = (name, extra = {}) => ({
    width: "100%",
    padding: "10px 12px",
    border: "2px solid var(--color-dark, #231e25)",
    borderRadius: 4,
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    marginTop: 4,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "box-shadow 0.2s ease",
    boxShadow: focused === name ? "4px 4px 0 var(--color-primary, #ff3e33)" : "2px 2px 0 #000",
    ...extra,
  });

  const labelStyle = {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "var(--color-dark, #231e25)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      {/* TICKER */}
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["EXPO CONFIGURATION", `${expos.length} EVENTS REGISTERED`, "BOOTH AUTO-GENERATION ENABLED", "REAL-TIME SYNC ACTIVE"]} color="var(--color-primary, #ff3e33)" duration={26} fontSize={11} />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{
          background: "#fff", border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0 var(--color-dark, #231e25)",
          padding: "24px 28px", position: "relative", overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={`${expos.length} EXPOS`} size={88} bg="var(--color-primary, #ff3e33)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primary, #ff3e33)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <PulseDot color="#fff" size={6} glow={false} />
            [ EXPO CONFIGURATION ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
            EXPO EVENT MANAGER
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: "6px 0 0 0", fontWeight: 600, maxWidth: 560 }}>
            Create expos, auto-generate booth layouts, and manage the event lifecycle.
          </p>
        </div>
      </motion.div>

      {/* BANNERS */}
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

      {/* FORM CARD */}
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
        style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "26px", position: "relative", overflow: "hidden" }}
      >
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.3} opacity={0.2} />
        {editingId && <Scanline color="rgba(254,184,4,0.28)" height={70} duration={2.2} />}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap", marginBottom: 20, position: "relative", zIndex: 2 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: editingId ? "var(--color-selective-yellow, #feb804)" : "var(--color-dark, #231e25)", color: editingId ? "#000" : "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 8, fontFamily: "'Satoshi', sans-serif" }}>
              <PulseDot color={editingId ? "#000" : "#fff"} size={6} glow={false} />
              {editingId ? "EDIT MODE" : "CREATE MODE"}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.6vw, 28px)", margin: 0, letterSpacing: 0.8 }}>
              {editingId ? "EDIT EXPO EVENT" : "CREATE NEW EXPO & AUTO-GENERATE BOOTHS"}
            </h3>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm}
              style={{ background: "#e5e7eb", color: "#000", border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "8px 16px", fontFamily: "var(--font-display)", fontSize: 16, cursor: "pointer" }}>
              CANCEL EDIT
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, position: "relative", zIndex: 2 }}>
          <div>
            <label style={labelStyle}>Expo Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} onFocus={() => setFocused("title")} onBlur={() => setFocused(null)} placeholder="Asia Tech Innovation Expo" style={inputStyle("title")} />
          </div>
          <div>
            <label style={labelStyle}>Theme / Industry</label>
            <input type="text" name="theme" value={formData.theme} onChange={handleChange} onFocus={() => setFocused("theme")} onBlur={() => setFocused(null)} placeholder="AI & Robotics" style={inputStyle("theme")} />
          </div>
          <div>
            <label style={labelStyle}>Convention Center / Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} onFocus={() => setFocused("loc")} onBlur={() => setFocused(null)} placeholder="KOMCA DPS 1, Penang" style={inputStyle("loc")} />
          </div>
          <div>
            <label style={labelStyle}>Start Date *</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} onFocus={() => setFocused("sd")} onBlur={() => setFocused(null)} style={inputStyle("sd")} />
          </div>
          <div>
            <label style={labelStyle}>End Date *</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} onFocus={() => setFocused("ed")} onBlur={() => setFocused(null)} style={inputStyle("ed")} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Expo Banner Image</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }} className="image-upload-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, fontWeight: 800, color: "#6b7280", letterSpacing: 0.6 }}>UPLOAD FILE</span>
                <input type="file" accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))}
                  style={{ padding: "8px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 12, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, fontWeight: 800, color: "#6b7280", letterSpacing: 0.6 }}>OR PASTE IMAGE URL</span>
                <input type="url" name="image" value={formData.image || ""} onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value, imageFile: null }))} placeholder="https://images.unsplash.com/..." style={inputStyle("img", { marginTop: 0 })} />
              </div>
            </div>
          </div>

          {!editingId && (
            <>
              <div>
                <label style={labelStyle}>Booth Count</label>
                <input type="number" name="boothCount" min="1" value={formData.boothCount} onChange={handleChange} style={inputStyle("bc")} />
              </div>
              <div>
                <label style={labelStyle}>Base Price ($)</label>
                <input type="number" name="boothPrice" min="0" value={formData.boothPrice} onChange={handleChange} style={inputStyle("bp")} />
              </div>
              <div>
                <label style={labelStyle}>Booth Size</label>
                <input type="text" name="boothSize" value={formData.boothSize} onChange={handleChange} style={inputStyle("bs")} />
              </div>
            </>
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description & Guidelines</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} onFocus={() => setFocused("desc")} onBlur={() => setFocused(null)}
              placeholder="Expo scope, exhibitor criteria, and attendee instructions"
              style={inputStyle("desc", { resize: "vertical", lineHeight: 1.55 })} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
            <motion.button type="submit" whileHover={{ y: -3, boxShadow: "6px 6px 0 #000" }} whileTap={{ y: 1, boxShadow: "2px 2px 0 #000" }}
              style={{ position: "relative", overflow: "hidden", background: editingId ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)", color: editingId ? "#000" : "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "12px 26px", fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <ShineSweep duration={1.4} delay={0} opacity={0.35} />
              <PulseDot color={editingId ? "#000" : "#fff"} size={7} glow={false} />
              {editingId ? "UPDATE EXPO EVENT" : "CREATE EXPO + GENERATE BOOTHS"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "24px", position: "relative", overflow: "hidden" }}
      >
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.18} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, position: "relative", zIndex: 2, flexWrap: "wrap" }}>
          <span style={{ width: 10, height: 10, background: "var(--color-primary, #ff3e33)", border: "1.5px solid #000", display: "inline-block" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.6vw, 28px)", margin: 0, letterSpacing: 0.8 }}>
            REGISTERED EXPO SCHEDULES
          </h3>
          <span style={{ background: "var(--color-dark, #231e25)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 14 }}>
            {expos.length}
          </span>
        </div>

        {loading ? (
          <Loading message="Loading expos..." />
        ) : expos.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280" }}>
            No expos created yet. Use the form above to create your first event.
          </div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 4, border: "2px solid #000", boxShadow: "4px 4px 0 #000", position: "relative", zIndex: 2 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, minWidth: 780 }}>
              <thead>
                <tr style={{ background: "var(--color-dark, #231e25)", color: "#fff", textAlign: "left" }}>
                  {["EXPO TITLE", "DATES", "LOCATION", "OPERATIONS"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", borderRight: "1.5px solid #000", letterSpacing: 1, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expos.map((expo, idx) => (
                  <motion.tr key={expo._id}
                    initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}
                    whileHover={{ background: "rgba(255,62,51,0.06)" }}
                    style={{ borderBottom: idx < expos.length - 1 ? "1.5px solid #000" : "none" }}>
                    <td style={{ padding: "14px", borderRight: "1.5px solid #000" }}>
                      <strong style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.4 }}>{expo.title}</strong>
                      {expo.theme && (
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <PulseDot color="var(--color-primary, #ff3e33)" size={5} glow={false} />
                          {expo.theme}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px", borderRight: "1.5px solid #000", fontWeight: 700, color: "#4b5563" }}>
                      {new Date(expo.startDate).toLocaleDateString()}<br />
                      <span style={{ color: "#9ca3af" }}>→</span> {new Date(expo.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px", borderRight: "1.5px solid #000", fontWeight: 700 }}>
                      {expo.location || "TBA"}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <motion.div whileHover={{ y: -2 }}>
                          <Link to={`/admin/expos/${expo._id}/booths`}
                            style={{ background: "var(--color-cerulean, #14a6ea)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, textDecoration: "none", fontSize: 11.5, fontWeight: 800, letterSpacing: 0.4, display: "inline-block" }}>
                            BOOTHS
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ y: -2 }}>
                          <Link to={`/admin/expos/${expo._id}/sessions`}
                            style={{ background: "var(--color-purple-mimosa, #a67eff)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, textDecoration: "none", fontSize: 11.5, fontWeight: 800, letterSpacing: 0.4, display: "inline-block" }}>
                            SESSIONS
                          </Link>
                        </motion.div>
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleEdit(expo)}
                          style={{ background: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, cursor: "pointer", fontSize: 11.5, fontWeight: 800 }}>
                          EDIT
                        </motion.button>
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleDelete(expo._id)}
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
        )}
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .image-upload-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminExpos;