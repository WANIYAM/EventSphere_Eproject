import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 6;

const ExhibitorExpos = () => {
  const { user } = useAuth();
  const [expos, setExpos] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedExpo, setSelectedExpo] = useState(null);
  const [formData, setFormData] = useState({ companyName: "", products: "" });
  const [documents, setDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exposRes, appsRes] = await Promise.all([
        api.get("/expos"),
        api.get("/applications/my"),
      ]);
      setExpos(exposRes.data || []);
      setMyApplications(appsRes.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load expos");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 5000);
    return () => clearTimeout(t);
  }, [success]);

  const hasApplied = (expoId) =>
    myApplications.some((app) => (app.expo?._id || app.expo) === expoId);

  const handleOpenApplyModal = (expo) => {
    setSelectedExpo(expo);
    setFormData({ companyName: user?.company || "", products: "" });
    setDocuments([]);
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) { setError("Maximum 3 documents allowed"); return; }
    setError("");
    setDocuments(files);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedExpo) return;
    setSubmitting(true); setError(""); setSuccess("");

    const data = new FormData();
    data.append("expo", selectedExpo._id);
    data.append("companyName", formData.companyName);
    data.append("products", formData.products);
    documents.forEach((doc) => data.append("documents", doc));

    try {
      await api.post("/applications", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(`Application submitted successfully for ${selectedExpo.title}!`);
      setSelectedExpo(null);
      fetchData();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to submit application");
    } finally { setSubmitting(false); }
  };

  const totalPages = Math.ceil(expos.length / ITEMS_PER_PAGE) || 1;
  const currentExpos = expos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const inputStyle = (name) => ({
    width: "100%", padding: "10px 12px", border: "2px solid #000",
    borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600,
    fontSize: 14, marginTop: 4, background: "#fff", outline: "none",
    boxSizing: "border-box",
    boxShadow: focused === name ? "4px 4px 0 var(--color-kiwi, #abf139)" : "2px 2px 0 #000",
    transition: "box-shadow 0.2s ease",
  });
  const labelStyle = { fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "#231e25", display: "inline-flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["EXHIBITION OPPORTUNITIES", `${expos.length} EXPOS OPEN`, `${myApplications.length} APPLICATIONS`, "BOOTH APPLICATIONS LIVE"]} color="var(--color-kiwi, #abf139)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text="APPLY NOW" size={92} bg="var(--color-kiwi, #abf139)" color="#000" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-kiwi, #abf139)", color: "#000", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <PulseDot color="#000" size={6} glow={false} />
            [ EXHIBITION OPPORTUNITIES ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 6px 0", letterSpacing: 1 }}>
            BROWSE UPCOMING EXPOS & TRADE SHOWS
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: 0, fontWeight: 600 }}>
            Apply for commercial booth space and showcase your products to thousands of registered buyers.
          </p>
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

      {loading ? (
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <Scanline color="rgba(171,241,57,0.3)" height={70} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-kiwi, #abf139)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>LOADING EXPO OPPORTUNITIES...</p>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : expos.length === 0 ? (
        <div style={{ background: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: 40, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280", position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
          No expos currently available for application.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 22 }}>
            {currentExpos.map((expo, idx) => {
              const applied = hasApplied(expo._id);
              const palette = [
                { bg: "var(--color-purple-mimosa, #a67eff)", fg: "#fff" },
                { bg: "var(--color-selective-yellow, #feb804)", fg: "#000" },
                { bg: "var(--color-primary, #ff3e33)", fg: "#fff" },
                { bg: "var(--color-kiwi, #abf139)", fg: "#000" },
              ][(idx + (currentPage - 1) * ITEMS_PER_PAGE) % 4];

              return (
                <motion.div key={expo._id}
                  initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -6, boxShadow: "10px 10px 0 var(--color-dark, #231e25)", rotate: -0.4 }}
                  style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "5px 5px 0 var(--color-dark, #231e25)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                  <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
                  <ShineSweep duration={1.7} delay={idx * 0.05} opacity={0.2} />

                  <div style={{ background: palette.bg, color: palette.fg, borderBottom: "2.5px solid var(--color-dark, #231e25)", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 0.6 }}>
                      <PulseDot color={palette.fg} size={6} glow={false} />
                      {expo.theme || "TRADE SHOW"}
                    </span>
                    {applied && (
                      <span style={{ background: "#000", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 3, letterSpacing: 0.6, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <PulseDot color="var(--color-kiwi, #abf139)" size={5} glow={false} />
                        APPLIED
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 16, position: "relative", zIndex: 2 }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--color-dark, #231e25)", margin: "0 0 8px 0", lineHeight: 0.95, letterSpacing: 0.5 }}>
                        {expo.title}
                      </h3>
                      <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12.5, color: "#6b7280", fontWeight: 700, marginBottom: 12, lineHeight: 1.6 }}>
                        🗓 {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}<br />
                        📍 {expo.location || "TBA"}
                      </div>
                      {expo.description && (
                        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#4b5563", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                          {expo.description.substring(0, 130)}{expo.description.length > 130 ? "..." : ""}
                        </p>
                      )}
                    </div>

                    <div style={{ borderTop: "1.5px dashed var(--color-dark, #231e25)", paddingTop: 14 }}>
                      {applied ? (
                        <button disabled style={{ width: "100%", background: "#e5e7eb", color: "#6b7280", border: "2px solid #9ca3af", padding: "11px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.6, cursor: "not-allowed", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          ✓ APPLICATION SUBMITTED
                        </button>
                      ) : (
                        <motion.button whileHover={{ y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={{ y: 1 }} onClick={() => handleOpenApplyModal(expo)}
                          style={{ position: "relative", overflow: "hidden", width: "100%", background: "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "11px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.6, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <ShineSweep duration={1.4} delay={0} opacity={0.35} />
                          APPLY FOR BOOTH SPACE →
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                    backgroundColor: currentPage === num ? "var(--color-kiwi, #abf139)" : "#ffffff",
                    color: "#000",
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

      {/* MODAL */}
      <AnimatePresence>
        {selectedExpo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(35, 30, 37, 0.78)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 }}
            onClick={() => !submitting && setSelectedExpo(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "12px 12px 0 var(--color-dark, #231e25)", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: "26px", position: "relative" }}>
              <CornerBrackets color="#000" inset={10} size={13} thickness={3} />
              <Scanline color="rgba(171,241,57,0.28)" height={70} duration={2.4} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2.5px solid #000", paddingBottom: 14, marginBottom: 16, position: "relative", zIndex: 2, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 6, fontFamily: "'Satoshi', sans-serif" }}>
                    <PulseDot color="#000" size={6} glow={false} />
                    BOOTH APPLICATION
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0, letterSpacing: 1, lineHeight: 1 }}>
                    {selectedExpo.title}
                  </h3>
                </div>
                <button onClick={() => !submitting && setSelectedExpo(null)} disabled={submitting}
                  style={{ background: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0 #000", width: 32, height: 32, borderRadius: "50%", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "var(--font-display)", fontSize: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 2 }}>
                <div>
                  <label style={labelStyle}>Company Name *</label>
                  <input type="text" required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} onFocus={() => setFocused("cn")} onBlur={() => setFocused(null)} placeholder="Enter your registered company name" style={inputStyle("cn")} />
                </div>
                <div>
                  <label style={labelStyle}>Products / Showcase Description</label>
                  <textarea rows="3" value={formData.products} onChange={(e) => setFormData({ ...formData, products: e.target.value })} onFocus={() => setFocused("pr")} onBlur={() => setFocused(null)} placeholder="Describe the products, prototypes, or services you plan to exhibit" style={{ ...inputStyle("pr"), resize: "vertical", lineHeight: 1.55 }} />
                </div>
                <div>
                  <label style={labelStyle}>Supporting Documents (Max 3)</label>
                  <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" onChange={handleFileChange}
                    style={{ width: "100%", padding: "10px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 12, marginTop: 4, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box" }} />
                  {documents.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {documents.map((d, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 8px", borderRadius: 3, fontSize: 10.5, fontWeight: 800, border: "1.5px solid #000", boxShadow: "1.5px 1.5px 0 #000" }}>
                          📄 {d.name.length > 20 ? d.name.slice(0, 20) + "…" : d.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <motion.button type="submit" disabled={submitting}
                  whileHover={submitting ? {} : { y: -3, boxShadow: "6px 6px 0 #000" }}
                  whileTap={{ y: 1 }}
                  style={{ position: "relative", overflow: "hidden", background: submitting ? "#9ca3af" : "var(--color-kiwi, #abf139)", color: "#000", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "12px", fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, cursor: submitting ? "not-allowed" : "pointer", marginTop: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {!submitting && <ShineSweep duration={1.4} delay={0} opacity={0.35} />}
                  {submitting && <PulseDot color="#000" size={7} glow={false} />}
                  {submitting ? "SUBMITTING APPLICATION..." : "SUBMIT BOOTH APPLICATION"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExhibitorExpos;