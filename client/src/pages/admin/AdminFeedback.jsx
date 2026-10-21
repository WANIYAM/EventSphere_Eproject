import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  GrainOverlay,
  TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 6;

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await api.get("/feedback");
      setFeedback(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load feedback");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchFeedback(); }, []);

  const handleFilterClick = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const filtered = filterType ? feedback.filter((f) => f.type === filterType) : feedback;
  const suggestionCount = feedback.filter((f) => f.type === "suggestion").length;
  const issueCount = feedback.filter((f) => f.type === "issue").length;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentFeedback = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["USER SENTIMENT FEED", `${feedback.length} SUBMISSIONS`, `${suggestionCount} SUGGESTIONS`, `${issueCount} ISSUES`]} color="var(--color-purple-mimosa, #a67eff)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={`${filtered.length} SHOWN`} size={86} bg="var(--color-purple-mimosa, #a67eff)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 18, position: "relative", zIndex: 2 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
              <PulseDot color="#fff" size={6} glow={false} />
              [ USER SENTIMENT & REVIEWS ]
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
              USER FEEDBACK & SUGGESTIONS
            </h1>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: "6px 0 0 0", fontWeight: 600 }}>
              Review what attendees and exhibitors have to say.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { id: "", label: "ALL", count: feedback.length, c: "var(--color-dark, #231e25)", t: "#fff" },
              { id: "suggestion", label: "SUGGESTIONS", count: suggestionCount, c: "var(--color-kiwi, #abf139)", t: "#000" },
              { id: "issue", label: "ISSUES", count: issueCount, c: "var(--color-primary, #ff3e33)", t: "#fff" },
            ].map((f) => {
              const active = filterType === f.id;
              return (
                <motion.button key={f.id || "all"} onClick={() => handleFilterClick(f.id)} whileHover={{ y: -3, rotate: active ? 0 : -0.6 }} whileTap={{ scale: 0.96 }}
                  style={{ position: "relative", overflow: "hidden", background: active ? f.c : "#fff", color: active ? f.t : "#231e25", border: "2px solid #000", boxShadow: active ? "4px 4px 0 var(--color-primary, #ff3e33)" : "2px 2px 0 #000", padding: "8px 14px", borderRadius: 30, fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: 0.6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {active && <ShineSweep duration={1.2} delay={0} opacity={0.3} />}
                  {active && <PulseDot color={f.t} size={6} glow={false} />}
                  {f.label}
                  <span style={{ background: active ? "rgba(0,0,0,0.25)" : "var(--color-dark, #231e25)", color: "#fff", padding: "1px 8px", borderRadius: 30, fontSize: 11, fontWeight: 900 }}>
                    {f.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {error && (
        <div style={{ background: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
          <PulseDot color="var(--color-primary, #ff3e33)" size={9} /> Error: {error}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "24px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.25} opacity={0.18} />

        {loading ? (
          <Loading message="Loading user feedback..." />
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280", position: "relative", zIndex: 2 }}>
            No feedback submitted yet.
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto", borderRadius: 4, border: "2px solid #000", boxShadow: "4px 4px 0 #000", position: "relative", zIndex: 2 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 13, minWidth: 860 }}>
                <thead>
                  <tr style={{ background: "var(--color-dark, #231e25)", color: "#fff", textAlign: "left" }}>
                    {["USER", "ROLE", "CATEGORY", "MESSAGE", "DATE"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", borderRight: "1.5px solid #000", letterSpacing: 1, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {currentFeedback.map((f, idx) => (
                      <motion.tr key={f._id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ delay: idx * 0.03 }}
                        whileHover={{ background: f.type === "issue" ? "rgba(255,62,51,0.05)" : "rgba(171,241,57,0.08)" }}
                        style={{ borderBottom: idx < currentFeedback.length - 1 ? "1.5px solid #000" : "none" }}>
                        <td style={{ padding: "14px", borderRight: "1.5px solid #000" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--color-dark, #231e25)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, flexShrink: 0 }}>
                              {(f.user?.name || "?").charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <strong>{f.user?.name}</strong>
                              <div style={{ fontSize: 11, color: "#6b7280" }}>{f.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px", borderRight: "1.5px solid #000" }}>
                          <span style={{ background: "#f3f4f6", border: "1.5px solid #000", padding: "3px 8px", borderRadius: 3, fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            {f.user?.role}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderRight: "1.5px solid #000" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: f.type === "suggestion" ? "var(--color-kiwi, #abf139)" : "var(--color-primary, #ff3e33)", color: f.type === "suggestion" ? "#000" : "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "4px 10px", borderRadius: 3, fontWeight: 900, fontSize: 11, letterSpacing: 0.4 }}>
                            <PulseDot color={f.type === "suggestion" ? "#000" : "#fff"} size={5} glow={false} />
                            {f.type === "suggestion" ? "SUGGESTION" : "ISSUE"}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderRight: "1.5px solid #000", maxWidth: 420, fontWeight: 500, lineHeight: 1.5 }}>
                          {f.message}
                        </td>
                        <td style={{ padding: "14px", whiteSpace: "nowrap", fontWeight: 700, color: "#4b5563" }}>
                          {new Date(f.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
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

export default AdminFeedback;