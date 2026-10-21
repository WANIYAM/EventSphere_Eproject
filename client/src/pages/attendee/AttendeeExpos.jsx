import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  TickStrip,
  GrainOverlay,
} from "../../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 6;

const AttendeeExpos = () => {
  const [expos, setExpos] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expoRes, regRes] = await Promise.all([
          api.get("/expos"),
          api.get("/registrations/my"),
        ]);
        setExpos(expoRes.data || []);
        setRegistrations(regRes.data || []);
        setCurrentPage(1);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to load expos");
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const isRegistered = (expoId) =>
    registrations.some((r) => r.type === "expo" && r.expo?._id === expoId && r.registered);

  const handleRegister = async (expoId) => {
    if (pendingId) return;
    setError(""); setSuccess("");
    setPendingId(expoId);
    try {
      await api.post("/registrations", { expo: expoId });
      setSuccess("Successfully registered for expo!");
      const res = await api.get("/registrations/my");
      setRegistrations(res.data || []);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Registration failed");
    } finally { setPendingId(null); }
  };

  const totalPages = Math.ceil(expos.length / ITEMS_PER_PAGE) || 1;
  const currentExpos = expos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ backgroundColor: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-cerulean, #14a6ea)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>LOADING EXPO DIRECTORY...</p>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ backgroundColor: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />

        <RotatingBadge text={`${expos.length} EXPOS`} size={86} bg="var(--color-cerulean, #14a6ea)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <PulseDot color="#fff" glow={false} size={6} />
            [ EXPO DIRECTORY ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
            UPCOMING TRADE SHOWS & EXPOS
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: "6px 0 0 0", fontWeight: 600, maxWidth: 560 }}>
            Browse the complete expo roster and claim your pass to any upcoming event.
          </p>
        </div>
      </motion.div>

      {/* TICKER */}
      <div style={{ backgroundColor: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["UPCOMING TRADE SHOWS", "FLOOR PLANS · BOOTHS · SPEAKERS", "CLAIM YOUR PASS"]} color="var(--color-cerulean, #14a6ea)" duration={26} fontSize={11} />
      </div>

      {/* STATUS */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} /> Error: {error}
          </motion.div>
        )}
        {success && (
          <motion.div key="suc" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "4px 4px 0 var(--color-dark, #231e25)", padding: "12px 16px", color: "#000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
            <ShineSweep duration={1.6} delay={0.2} opacity={0.4} />
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#000", color: "var(--color-kiwi, #abf139)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, border: "2px solid #000", flexShrink: 0 }}>✓</span>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      {expos.length === 0 ? (
        <div style={{ backgroundColor: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: 40, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
          No expos available yet.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
            {currentExpos.map((expo, idx) => {
              const registered = isRegistered(expo._id);
              const bannerColors = [
                { bg: "var(--color-primary, #ff3e33)", text: "#fff" },
                { bg: "var(--color-selective-yellow, #feb804)", text: "#000" },
                { bg: "var(--color-purple-mimosa, #a67eff)", text: "#fff" },
                { bg: "var(--color-kiwi, #abf139)", text: "#000" },
              ];
              const palette = bannerColors[(idx + (currentPage - 1) * ITEMS_PER_PAGE) % bannerColors.length];

              return (
                <motion.div
                  key={expo._id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -6, boxShadow: "10px 10px 0 var(--color-dark, #231e25)", rotate: -0.4 }}
                  style={{
                    backgroundColor: "#fff",
                    border: "3px solid var(--color-dark, #231e25)",
                    boxShadow: "5px 5px 0 var(--color-dark, #231e25)",
                    display: "flex", flexDirection: "column",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
                  <ShineSweep duration={1.7} delay={idx * 0.05} opacity={0.2} />

                  {/* Banner */}
                  <div style={{
                    backgroundColor: palette.bg, color: palette.text,
                    borderBottom: "2.5px solid var(--color-dark, #231e25)",
                    padding: "10px 18px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    position: "relative", zIndex: 2,
                  }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 0.6 }}>
                      <PulseDot color={palette.text === "#fff" ? "#fff" : "#000"} size={6} glow={false} />
                      {expo.theme || "INDUSTRY EXPO"}
                    </span>
                    {registered && (
                      <span style={{ backgroundColor: "#000", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 2, letterSpacing: 0.6, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <PulseDot color="var(--color-kiwi, #abf139)" size={5} glow={false} />
                        CLAIMED
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 16, position: "relative", zIndex: 2 }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--color-dark, #231e25)", margin: "0 0 8px 0", lineHeight: 0.95, letterSpacing: 0.5 }}>
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

                    <div style={{ display: "flex", gap: 10, borderTop: "1.5px dashed var(--color-dark, #231e25)", paddingTop: 14, flexWrap: "wrap" }}>
                      <motion.div whileHover={{ x: 3 }} style={{ flex: 1, minWidth: 140 }}>
                        <Link
                          to={`/attendee/expos/${expo._id}`}
                          style={{
                            display: "block",
                            backgroundColor: "var(--color-dark, #231e25)",
                            color: "var(--color-light, #fff8eb)",
                            border: "2px solid var(--color-dark, #231e25)",
                            boxShadow: "2px 2px 0 #000",
                            padding: "8px 14px",
                            borderRadius: 3,
                            textDecoration: "none",
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                            letterSpacing: 0.6,
                            textAlign: "center",
                          }}
                        >
                          VIEW FLOOR PLAN →
                        </Link>
                      </motion.div>

                      {registered ? (
                        <span style={{
                          backgroundColor: "var(--color-kiwi, #abf139)", color: "#000",
                          border: "2px solid var(--color-dark, #231e25)", boxShadow: "2px 2px 0 #000",
                          padding: "8px 14px", borderRadius: 3,
                          fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 0.6,
                          display: "inline-flex", alignItems: "center", gap: 6,
                        }}>
                          <span>✓</span> CLAIMED
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ y: -2, boxShadow: "4px 4px 0 #000" }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleRegister(expo._id)}
                          disabled={pendingId === expo._id}
                          style={{
                            position: "relative", overflow: "hidden",
                            backgroundColor: pendingId === expo._id ? "#9ca3af" : "var(--color-primary, #ff3e33)",
                            color: "#fff",
                            border: "2px solid var(--color-dark, #231e25)",
                            boxShadow: "2px 2px 0 #000",
                            padding: "8px 16px",
                            borderRadius: 3,
                            fontFamily: "var(--font-display)",
                            fontSize: 16, letterSpacing: 0.6,
                            cursor: pendingId === expo._id ? "not-allowed" : "pointer",
                            display: "inline-flex", alignItems: "center", gap: 6,
                          }}
                        >
                          {pendingId === expo._id && <PulseDot color="#fff" size={6} glow={false} />}
                          {pendingId === expo._id ? "CLAIMING..." : "+ CLAIM PASS"}
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
                    backgroundColor: currentPage === num ? "var(--color-cerulean, #14a6ea)" : "#ffffff",
                    color: currentPage === num ? "#ffffff" : "#000000",
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

export default AttendeeExpos;