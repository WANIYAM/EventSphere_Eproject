import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { ShineSweep, PulseDot, RotatingBadge } from "../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 6;

export default function Expos() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/expos");
        setExpos(res.data || []);
      } catch (err) {
        try {
          const fallbackRes = await api.get("/public/landing-data");
          setExpos(fallbackRes.data?.allExpos || []);
        } catch {
          setError("Failed to load trade show directory.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExpos();
  }, []);

  const filterTabs = [
    { id: "all", label: "ALL EXPOS" },
    { id: "penang", label: "PENANG" },
    { id: "kl", label: "KUALA LUMPUR" },
    { id: "san francisco", label: "SAN FRANCISCO" },
  ];

  const handleFilterClick = (tabId) => {
    setActiveFilter(tabId);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const filteredExpos = expos.filter((expo) => {
    if (activeFilter === "all") return true;
    const loc = (expo.location || "").toLowerCase();
    return loc.includes(activeFilter);
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredExpos.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentExpos = filteredExpos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const cardPalettes = [
    "var(--color-light, #fff8eb)",
    "var(--color-selective-yellow, #feb804)",
    "var(--color-purple-mimosa, #a67eff)",
    "var(--color-kiwi, #abf139)",
    "var(--color-light-salmon, #ffa490)",
    "var(--color-cerulean, #14a6ea)",
  ];

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "110px clamp(16px, 4vw, 56px) 60px clamp(16px, 4vw, 56px)" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            <PulseDot color="#fff" glow={false} size={6} />
            <span>PUBLIC EXPO DIRECTORY</span>
          </div>

          <h1
            className="style-display"
            style={{
              fontSize: "clamp(48px, 7.5vw, 100px)",
              color: "var(--color-dark, #231e25)",
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: 1.5,
            }}
          >
            UPCOMING TRADE SHOWS
          </h1>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleFilterClick(tab.id)}
                whileHover={{ y: -3, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "8px 18px",
                  borderRadius: 30,
                  backgroundColor: isActive ? "var(--color-dark, #231e25)" : "#ffffff",
                  color: isActive ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                  border: "2px solid var(--color-dark, #231e25)",
                  boxShadow: isActive ? "3px 3px 0px var(--color-primary, #ff3e33)" : "2px 2px 0px var(--color-dark, #231e25)",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  letterSpacing: 0.5,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isActive && <ShineSweep duration={1.2} opacity={0.3} />}
                <span style={{ position: "relative", zIndex: 7 }}>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", border: "2px solid red", padding: 14, marginBottom: 20, fontWeight: 700 }}>
            Notice: {error}
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, padding: 40 }}>Loading trade show directory...</p>
        ) : filteredExpos.length === 0 ? (
          <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 40, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
            No expos match your filter criteria.
          </div>
        ) : (
          <>
            {/* Results count strip */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 24,
                paddingBottom: 10,
                borderBottom: "2px dashed var(--color-dark, #231e25)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  letterSpacing: 1,
                  color: "var(--color-dark, #231e25)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    backgroundColor: "var(--color-dark, #231e25)",
                    color: "var(--color-light, #fff8eb)",
                    padding: "3px 10px",
                    borderRadius: 3,
                    fontSize: 14,
                  }}
                >
                  {String(filteredExpos.length).padStart(2, "0")}
                </span>
                EVENT{filteredExpos.length !== 1 ? "S" : ""} SCHEDULED
                <span style={{ fontSize: 13, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280" }}>
                  (SHOWING {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredExpos.length)})
                </span>
              </span>
            </div>

            {/* Grid scaled safely for 320px viewports without horizontal overflow */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                gap: "40px 28px",
              }}
            >
              <AnimatePresence mode="popLayout">
                {currentExpos.map((expo, idx) => {
                  const bg = cardPalettes[(startIndex + idx) % cardPalettes.length];
                  const isDark = bg === "var(--color-purple-mimosa, #a67eff)";

                  return (
                    <motion.div
                      key={expo._id || idx}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                      whileHover={{ y: -8, boxShadow: "10px 10px 0px var(--color-dark, #231e25)" }}
                      style={{
                        backgroundColor: bg,
                        color: isDark ? "#ffffff" : "var(--color-dark, #231e25)",
                        border: "3px solid var(--color-dark, #231e25)",
                        boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 440,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <ShineSweep duration={1.6} delay={idx * 0.08} opacity={0.3} />
                      {idx === 0 && currentPage === 1 && (
                        <RotatingBadge text="NEXT UP" size={72} bg="var(--color-kiwi, #abf139)" color="#000" top={-18} right={-18} duration={15} />
                      )}

                      {/* Expo Card Image Banner */}
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          backgroundColor: "#000",
                          backgroundImage: `url(${expo.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderBottom: "2.5px solid var(--color-dark, #231e25)",
                        }}
                      />

                      <div style={{ padding: "20px 22px 18px 22px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ backgroundColor: "#000", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800 }}>
                            {expo.theme || "TRADE SHOW"}
                          </span>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, opacity: 0.8 }}>
                            0{startIndex + idx + 1}
                          </span>
                        </div>

                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 2.8vw, 36px)", lineHeight: 0.92, margin: "2px 0 0 0" }}>
                          {expo.title}
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
                          <span>Location: {expo.location || "Convention Hall"}</span>
                          <span>Dates: {new Date(expo.startDate).toLocaleDateString()} to {new Date(expo.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", padding: "14px 18px", backgroundColor: "rgba(0,0,0,0.06)", display: "flex" }}>
                        <Link
                          to={`/expos/${expo._id}`}
                          style={{
                            flex: 1,
                            backgroundColor: "var(--color-dark, #231e25)",
                            color: "var(--color-light, #fff8eb)",
                            border: "2px solid #000000",
                            boxShadow: "2px 2px 0px #000000",
                            padding: "10px",
                            textAlign: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            textDecoration: "none",
                          }}
                        >
                          VIEW DETAILS
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ───────────────────── PAGINATION CONTROLS ───────────────────── */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {/* Previous Button */}
                <motion.button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  whileHover={currentPage === 1 ? {} : { y: -2, boxShadow: "4px 4px 0 #000" }}
                  whileTap={currentPage === 1 ? {} : { y: 1 }}
                  style={{
                    backgroundColor: currentPage === 1 ? "#e5e7eb" : "var(--color-dark, #231e25)",
                    color: currentPage === 1 ? "#9ca3af" : "var(--color-light, #fff8eb)",
                    border: "2px solid #000",
                    boxShadow: currentPage === 1 ? "none" : "2.5px 2.5px 0 #000",
                    padding: "8px 18px",
                    borderRadius: 4,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    letterSpacing: 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ← PREV
                </motion.button>

                {/* Page Number Pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = currentPage === pageNum;
                  return (
                    <motion.button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      whileHover={{ y: -2, boxShadow: "3px 3px 0 #000" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        minWidth: 40,
                        height: 40,
                        backgroundColor: isActive
                          ? "var(--color-primary, #ff3e33)"
                          : "#ffffff",
                        color: isActive ? "#ffffff" : "var(--color-dark, #231e25)",
                        border: "2px solid #000",
                        boxShadow: isActive ? "3px 3px 0 #000" : "2px 2px 0 #000",
                        borderRadius: 4,
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 900,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                {/* Next Button */}
                <motion.button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  whileHover={currentPage === totalPages ? {} : { y: -2, boxShadow: "4px 4px 0 #000" }}
                  whileTap={currentPage === totalPages ? {} : { y: 1 }}
                  style={{
                    backgroundColor: currentPage === totalPages ? "#e5e7eb" : "var(--color-dark, #231e25)",
                    color: currentPage === totalPages ? "#9ca3af" : "var(--color-light, #fff8eb)",
                    border: "2px solid #000",
                    boxShadow: currentPage === totalPages ? "none" : "2.5px 2.5px 0 #000",
                    padding: "8px 18px",
                    borderRadius: 4,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    letterSpacing: 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  NEXT →
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}