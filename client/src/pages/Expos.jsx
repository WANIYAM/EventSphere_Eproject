import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { ShineSweep, PulseDot, RotatingBadge } from "../components/common/NeoBrutalKit.jsx";

export default function Expos() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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

  const filteredExpos = expos.filter((expo) => {
    if (activeFilter === "all") return true;
    const loc = (expo.location || "").toLowerCase();
    return loc.includes(activeFilter);
  });

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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 44 }}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
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
          /* Grid scaled safely for 320px viewports without horizontal overflow */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: "40px 28px",
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredExpos.map((expo, idx) => {
                const bg = cardPalettes[idx % cardPalettes.length];
                const isDark = bg === "var(--color-purple-mimosa, #a67eff)";

                return (
                  <motion.div
                    key={expo._id || idx}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
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
                    {idx === 0 && <RotatingBadge text="NEXT UP" size={72} bg="var(--color-kiwi, #abf139)" color="#000" top={-18} right={-18} duration={15} />}
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
                          0{idx + 1}
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
        )}
      </main>
    </div>
  );
}