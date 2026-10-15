import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

export const ExhibitorsSection: React.FC<{ exhibitors?: any[] }> = ({ exhibitors = [] }) => {
  const [shuffleKey, setShuffleKey] = useState(0);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(() => new Set());

  // Randomly select 3 unique exhibitors on load or when shuffle is clicked
  const featuredExhibitors = useMemo(() => {
    if (!exhibitors || exhibitors.length === 0) return [];
    const shuffled = [...exhibitors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Pick 3 random exhibitors
  }, [exhibitors, shuffleKey]);

  const cardPalettes = [
    { bg: "var(--color-kiwi, #abf139)", text: "#000000", tagBg: "var(--color-dark)" },
    { bg: "var(--color-selective-yellow, #feb804)", text: "#000000", tagBg: "var(--color-dark)" },
    { bg: "var(--color-violet-pink, #ff55f8)", text: "#ffffff", tagBg: "var(--color-dark)" },
    { bg: "var(--color-cerulean, #14a6ea)", text: "#ffffff", tagBg: "var(--color-dark)" },
    { bg: "var(--color-purple-mimosa, #a67eff)", text: "#ffffff", tagBg: "var(--color-dark)" },
  ];

  return (
    <section
      id="exhibitors"
      style={{
        backgroundColor: "transparent",
        padding: "100px clamp(20px, 4vw, 56px) 140px clamp(20px, 4vw, 56px)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        
        {/* Section Header with Shuffle Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 44 }}>
          <div>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "var(--color-dark, #231e25)",
                color: "var(--color-light, #fff8eb)",
                padding: "4px 12px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              [ EXHIBITOR DIRECTORY // COMPANY PROFILES ]
            </div>
            <h2
              className="style-display"
              style={{
                fontSize: "clamp(52px, 7.5vw, 102px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.9,
                margin: 0,
                letterSpacing: 2,
              }}
            >
              EXPLORE &#123; EXHIBITORS &#125;
            </h2>
          </div>

          {/* Shuffle Button */}
          <motion.button
            onClick={() => setShuffleKey((prev) => prev + 1)}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              padding: "10px 22px",
              borderRadius: 40,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>SHOW OTHER EXHIBITORS</span>
          </motion.button>
        </div>

        {/* 3-Column Grid with Scroll-Triggered Staggered Spring Entrance */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            width: "100%",
          }}
        >
          <AnimatePresence mode="popLayout">
            {featuredExhibitors.map((ex, idx) => {
              const palette = cardPalettes[(idx + shuffleKey) % cardPalettes.length];
              const logoKey = String(ex._id || ex.company || idx);
              const logoSrc = ex.logo
                ? /^https?:\/\//i.test(ex.logo)
                  ? ex.logo
                  : `${API_BASE_URL}${ex.logo.startsWith("/") ? "" : "/"}${ex.logo}`
                : null;

              return (
                <motion.div
                  key={ex._id || idx}
                  layout
                  // SCROLL TRIGGER ENTRANCE
                  initial={{ opacity: 0, y: 90, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 22,
                    mass: 0.8,
                    delay: idx * 0.14, // Staggered cascade delay
                  }}
                  exit={{ opacity: 0, scale: 0.85, y: -40 }}
                  whileHover={{ y: -8, boxShadow: "10px 10px 0px var(--color-dark, #231e25)" }}
                  style={{
                    backgroundColor: palette.bg,
                    color: palette.text,
                    border: "3px solid var(--color-dark, #231e25)",
                    boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 24,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* 4 Corner Viewfinder Handles */}
                  <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: palette.text === "#fff" ? "#000" : "#fff", border: "1.5px solid #000", zIndex: 10 }} />
                  <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: palette.text === "#fff" ? "#000" : "#fff", border: "1.5px solid #000", zIndex: 10 }} />
                  <div style={{ position: "absolute", bottom: -5, left: -5, width: 9, height: 9, backgroundColor: palette.text === "#fff" ? "#000" : "#fff", border: "1.5px solid #000", zIndex: 10 }} />
                  <div style={{ position: "absolute", bottom: -5, right: -5, width: 9, height: 9, backgroundColor: palette.text === "#fff" ? "#000" : "#fff", border: "1.5px solid #000", zIndex: 10 }} />

                  <div>
                    {/* Top Row: Logo + Booth Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div
                        style={{
                          width: 68,
                          height: 68,
                          borderRadius: 6,
                          border: "2px solid #000",
                          backgroundColor: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          boxShadow: "2px 2px 0px #000",
                        }}
                      >
                        {logoSrc && !failedLogos.has(logoKey) ? (
                          <img
                            src={logoSrc}
                            alt={ex.company}
                            onError={() => setFailedLogos((previous) => new Set(previous).add(logoKey))}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 800 }}>No logo</span>
                        )}
                      </div>

                      <span
                        style={{
                          backgroundColor: "var(--color-dark, #231e25)",
                          color: "#ffffff",
                          padding: "4px 12px",
                          borderRadius: 3,
                          fontSize: 12,
                          fontFamily: "var(--font-display)",
                          letterSpacing: 0.5,
                          boxShadow: "2px 2px 0px rgba(0,0,0,0.2)",
                        }}
                      >
                        {ex.boothNumber ? `BOOTH ${ex.boothNumber}` : "BOOTH NOT ASSIGNED"}
                      </span>
                    </div>

                    {/* Category Tag */}
                    <span
                      style={{
                        backgroundColor: "rgba(0,0,0,0.85)",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: 2,
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {ex.category || "Technology"}
                    </span>

                    {/* Company Name */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(34px, 3.5vw, 44px)",
                        margin: "8px 0 10px 0",
                        lineHeight: 0.95,
                        letterSpacing: 0.8,
                      }}
                    >
                      {ex.company || ex.name}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 15,
                        lineHeight: 1.45,
                        margin: 0,
                        fontWeight: 500,
                        opacity: 0.95,
                      }}
                    >
                      {ex.description ? ex.description.substring(0, 115) + "..." : "Company profile and product details will appear here."}
                    </p>
                  </div>

                  {/* Bottom Action Link */}
                  <div style={{ borderTop: "2px solid rgba(0,0,0,0.25)", paddingTop: 16 }}>
                    <Link
                      to={`/exhibitors/${ex._id}`}
                      style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        border: "2px solid #000000",
                        boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
                        padding: "10px 18px",
                        textAlign: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        textDecoration: "none",
                        letterSpacing: 0.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>VIEW EXHIBITOR PROFILE</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};