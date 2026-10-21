import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 5;

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/my");
      setApplications(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load applications");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, []);

  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const pendingCount = applications.filter((a) => a.status !== "approved" && a.status !== "rejected").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  const statusColors = {
    approved: { bg: "var(--color-kiwi, #abf139)", fg: "#000", label: "APPROVED" },
    rejected: { bg: "var(--color-primary, #ff3e33)", fg: "#fff", label: "REJECTED" },
    pending: { bg: "var(--color-selective-yellow, #feb804)", fg: "#000", label: "PENDING" },
  };

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE) || 1;
  const currentApplications = applications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["BOOTH APPLICATIONS", `${approvedCount} APPROVED`, `${pendingCount} PENDING`, `${rejectedCount} REJECTED`]} color="var(--color-selective-yellow, #feb804)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={`${applications.length} TOTAL`} size={92} bg="var(--color-selective-yellow, #feb804)" color="#000" top={-20} right={-20} duration={17} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-selective-yellow, #feb804)", color: "#000", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
              <PulseDot color="#000" size={6} glow={false} />
              [ BOOTH APPLICATIONS ]
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 6px 0", letterSpacing: 1 }}>
              MY EXPO APPLICATIONS
            </h1>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: 0, fontWeight: 600 }}>
              Track your booth submissions and assigned spaces.
            </p>
          </div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link to="/exhibitor/expos"
              style={{ position: "relative", overflow: "hidden", background: "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "12px 22px", borderRadius: 4, textDecoration: "none", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ShineSweep duration={1.4} delay={0} opacity={0.35} />
              + BROWSE MORE EXPOS
            </Link>
          </motion.div>
        </div>

        {applications.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 16, marginTop: 16, borderTop: "2px dashed #000", position: "relative", zIndex: 2 }}>
            {[
              { l: "APPROVED", v: approvedCount, c: "var(--color-kiwi, #abf139)", t: "#000" },
              { l: "PENDING", v: pendingCount, c: "var(--color-selective-yellow, #feb804)", t: "#000" },
              { l: "REJECTED", v: rejectedCount, c: "var(--color-primary, #ff3e33)", t: "#fff" },
            ].map((p) => (
              <span key={p.l} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: p.c, color: p.t, border: "2px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 12px", borderRadius: 30, fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 0.6 }}>
                <PulseDot color={p.t} size={6} glow={false} />
                {p.l}:
                <span style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>{p.v}</span>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {error && (
        <div style={{ background: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
          <PulseDot color="var(--color-primary, #ff3e33)" size={9} /> Error: {error}
        </div>
      )}

      {loading ? (
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <Scanline color="rgba(254,184,4,0.3)" height={70} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-selective-yellow, #feb804)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>LOADING APPLICATIONS...</p>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : applications.length === 0 ? (
        <div style={{ background: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: 40, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280", position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
          You haven't submitted any booth applications yet.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
              {currentApplications.map((app, idx) => {
                const sc = statusColors[app.status] || statusColors.pending;
                return (
                  <motion.div key={app._id}
                    initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4, boxShadow: `8px 8px 0 ${sc.bg}` }}
                    style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", borderLeft: `6px solid ${sc.bg}`, boxShadow: "4px 4px 0 var(--color-dark, #231e25)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden" }}>
                    <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
                    <ShineSweep duration={1.7} delay={idx * 0.05} opacity={0.2} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px dashed #000", paddingBottom: 12, position: "relative", zIndex: 2, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 900, letterSpacing: 1, color: "#6b7280", fontFamily: "'Satoshi', sans-serif", textTransform: "uppercase", marginBottom: 4 }}>
                          <PulseDot color={sc.bg} size={5} glow={false} />
                          APPLICATION #{String(idx + 1 + (currentPage - 1) * ITEMS_PER_PAGE).padStart(2, "0")}
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0, letterSpacing: 0.6 }}>
                          {app.expo?.title || "Trade Show Expo"}
                        </h3>
                      </div>

                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: sc.bg, color: sc.fg, border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "5px 12px", borderRadius: 3, fontWeight: 900, fontSize: 11, letterSpacing: 0.8, fontFamily: "'Satoshi', sans-serif" }}>
                        <PulseDot color={sc.fg} size={6} glow={false} />
                        {sc.label}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, fontFamily: "'Satoshi', sans-serif", fontSize: 13, position: "relative", zIndex: 2 }}>
                      <div style={{ background: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0 #000", padding: "10px 12px", borderRadius: 4 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>COMPANY</div>
                        <strong style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>{app.companyName || "N/A"}</strong>
                        <div style={{ marginTop: 6, fontSize: 12, color: "#4b5563", fontWeight: 600 }}>
                          {app.products || "No products listed"}
                        </div>
                      </div>

                      <div style={{ background: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0 #000", padding: "10px 12px", borderRadius: 4 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>EXPO DATES</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 0.4 }}>
                          {app.expo?.startDate && new Date(app.expo.startDate).toLocaleDateString()} → {app.expo?.endDate && new Date(app.expo.endDate).toLocaleDateString()}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
                          📍 {app.expo?.location || "TBA"}
                        </div>
                      </div>

                      <div style={{ background: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0 #000", padding: "10px 12px", borderRadius: 4 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>ASSIGNED BOOTH</div>
                        {app.booth ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primary, #ff3e33)", color: "#fff", padding: "4px 10px", borderRadius: 3, fontWeight: 900, fontSize: 12, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
                            <PulseDot color="#fff" size={6} glow={false} />
                            BOOTH {app.booth.boothNumber}
                          </span>
                        ) : (
                          <span style={{ color: "#6b7280", fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                            ⏳ PENDING ASSIGNMENT
                          </span>
                        )}
                      </div>
                    </div>

                    {app.documents && app.documents.length > 0 && (
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 900, fontFamily: "'Satoshi', sans-serif", letterSpacing: 0.8, color: "#6b7280", textTransform: "uppercase" }}>
                          ATTACHMENTS:
                        </span>
                        {app.documents.map((docPath, i) => (
                          <motion.a key={i} href={`http://localhost:5000${docPath}`} target="_blank" rel="noreferrer" whileHover={{ y: -2 }}
                            style={{ background: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 11, textDecoration: "none", fontWeight: 800, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            📄 DOC {i + 1}
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
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
                    backgroundColor: currentPage === num ? "var(--color-selective-yellow, #feb804)" : "#ffffff",
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
    </div>
  );
};

export default MyApplications;