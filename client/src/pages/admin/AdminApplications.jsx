import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingId, setPendingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/applications?status=${statusFilter}` : "/applications";
      const res = await api.get(url);
      setApplications(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load applications");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [statusFilter]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const handleStatusUpdate = async (id, newStatus) => {
    if (pendingId) return;
    setError(""); setSuccess("");
    setPendingId(id);
    try {
      await api.put(`/applications/${id}/status`, { status: newStatus });
      setSuccess(`Application marked as ${newStatus}!`);
      fetchApplications();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || `Failed to update status to ${newStatus}`);
    } finally { setPendingId(null); }
  };

  const statusColors = {
    approved: { bg: "var(--color-kiwi, #abf139)", fg: "#000" },
    rejected: { bg: "var(--color-primary, #ff3e33)", fg: "#fff" },
    pending: { bg: "var(--color-selective-yellow, #feb804)", fg: "#000" },
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["EXHIBITOR APPROVALS", `${applications.length} APPLICATIONS`, "BOOTH ALLOCATION QUEUE"]} color="var(--color-selective-yellow, #feb804)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={`${applications.length} QUEUE`} size={86} bg="var(--color-selective-yellow, #feb804)" color="#000" top={-20} right={-20} duration={17} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-selective-yellow, #feb804)", color: "#000", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
              <PulseDot color="#000" size={6} glow={false} />
              [ EXHIBITOR APPROVALS ]
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
              EXHIBITOR BOOTH APPLICATIONS
            </h1>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {[
              { id: "", label: "ALL" },
              { id: "pending", label: "PENDING" },
              { id: "approved", label: "APPROVED" },
              { id: "rejected", label: "REJECTED" },
            ].map((f) => {
              const active = statusFilter === f.id;
              return (
                <motion.button key={f.id || "all"} onClick={() => setStatusFilter(f.id)} whileHover={{ y: -3, rotate: active ? 0 : -0.6 }} whileTap={{ scale: 0.96 }}
                  style={{ position: "relative", overflow: "hidden", background: active ? "var(--color-dark, #231e25)" : "#fff", color: active ? "#fff" : "#231e25", border: "2px solid #000", boxShadow: active ? "4px 4px 0 var(--color-selective-yellow, #feb804)" : "2px 2px 0 #000", padding: "8px 14px", borderRadius: 30, fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: 0.6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {active && <ShineSweep duration={1.2} delay={0} opacity={0.3} />}
                  {active && <PulseDot color="var(--color-selective-yellow, #feb804)" size={6} glow={false} />}
                  {f.label}
                </motion.button>
              );
            })}
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
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "24px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.25} opacity={0.18} />

        {loading ? (
          <Loading message="Loading applications..." />
        ) : applications.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280", position: "relative", zIndex: 2 }}>No applications found.</div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 4, border: "2px solid #000", boxShadow: "4px 4px 0 #000", position: "relative", zIndex: 2 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 12.5, minWidth: 1180 }}>
              <thead>
                <tr style={{ background: "var(--color-dark, #231e25)", color: "#fff", textAlign: "left" }}>
                  {["EXHIBITOR", "COMPANY", "TARGET EXPO", "PRODUCTS & DOCS", "STATUS", "ASSIGNED BOOTH", "DECISION"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", borderRight: "1.5px solid #000", letterSpacing: 1, fontSize: 10.5, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {applications.map((app, idx) => {
                    const sc = statusColors[app.status] || statusColors.pending;
                    const rowPending = pendingId === app._id;
                    return (
                      <motion.tr key={app._id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ delay: idx * 0.03 }}
                        whileHover={{ background: "rgba(254,184,4,0.06)" }}
                        style={{ borderBottom: idx < applications.length - 1 ? "1.5px solid #000" : "none", opacity: rowPending ? 0.6 : 1 }}>
                        <td style={{ padding: "12px 14px", borderRight: "1.5px solid #000" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--color-dark, #231e25)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, flexShrink: 0 }}>
                              {(app.exhibitor?.name || "?").charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <strong>{app.exhibitor?.name}</strong>
                              <div style={{ fontSize: 11, color: "#6b7280" }}>{app.exhibitor?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", borderRight: "1.5px solid #000", fontWeight: 700 }}>
                          {app.companyName || app.exhibitor?.company || "N/A"}
                        </td>
                        <td style={{ padding: "12px 14px", borderRight: "1.5px solid #000", fontWeight: 600, color: "#4b5563" }}>
                          {app.expo?.title || "N/A"}
                        </td>
                        <td style={{ padding: "12px 14px", borderRight: "1.5px solid #000", maxWidth: 240 }}>
                          <div style={{ fontWeight: 600 }}>{app.products || "N/A"}</div>
                          {app.documents && app.documents.length > 0 && (
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                              {app.documents.map((docPath, i) => (
                                <a key={i} href={`http://localhost:5000${docPath}`} target="_blank" rel="noreferrer"
                                  style={{ background: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 8px", borderRadius: 3, fontSize: 10, textDecoration: "none", fontWeight: 800, border: "1.5px solid #000", boxShadow: "1.5px 1.5px 0 #000" }}>
                                  📄 DOC {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", borderRight: "1.5px solid #000" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: sc.bg, color: sc.fg, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "4px 10px", borderRadius: 3, fontWeight: 900, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase" }}>
                            <PulseDot color={sc.fg} size={5} glow={false} />
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", borderRight: "1.5px solid #000" }}>
                          {app.booth ? (
                            <span style={{ background: "#000", color: "#fff", padding: "3px 8px", borderRadius: 3, fontWeight: 800, fontSize: 11, border: "1.5px solid #000", display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <PulseDot color="var(--color-primary, #ff3e33)" size={5} glow={false} />
                              BOOTH {app.booth.boothNumber}
                            </span>
                          ) : (
                            <span style={{ color: "#9ca3af", fontWeight: 700, fontSize: 11 }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: 5 }}>
                            {app.status !== "approved" && (
                              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} disabled={rowPending} onClick={() => handleStatusUpdate(app._id, "approved")}
                                style={{ background: "var(--color-kiwi, #abf139)", color: "#000", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, cursor: rowPending ? "not-allowed" : "pointer", fontWeight: 900, fontSize: 10.5, letterSpacing: 0.4, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                {rowPending && <PulseDot color="#000" size={5} glow={false} />}
                                APPROVE
                              </motion.button>
                            )}
                            {app.status !== "rejected" && (
                              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} disabled={rowPending} onClick={() => handleStatusUpdate(app._id, "rejected")}
                                style={{ background: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 10px", borderRadius: 3, cursor: rowPending ? "not-allowed" : "pointer", fontWeight: 900, fontSize: 10.5, letterSpacing: 0.4, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                {rowPending && <PulseDot color="#fff" size={5} glow={false} />}
                                REJECT
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminApplications;