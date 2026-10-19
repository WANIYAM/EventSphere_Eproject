import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  Scanline,
  GrainOverlay,
  TickStrip,
} from "../components/common/NeoBrutalKit.jsx";

const BASE = "http://localhost:5000";

export default function Exhibitors() {
  const [exhibitors, setExhibitors] = useState([]);
  const [categories, setCategories] = useState(["All categories"]);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== "All categories") params.category = selectedCategory;

      const res = await api.get("/public/exhibitors", { params });
      const data = res.data || [];
      setExhibitors(data);

      if (selectedCategory === "All categories" && !search.trim()) {
        const found = Array.from(
          new Set(
            data
              .map((e) => e.category)
              .filter((c) => c && typeof c === "string" && c.trim() !== "")
          )
        ).sort();
        setCategories(["All categories", ...found]);
      }
    } catch (err) {
      console.error("Failed to load exhibitors:", err);
      setError(
        err.userMessage ||
          err.response?.data?.message ||
          "Failed to load exhibitors directory."
      );
      setExhibitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExhibitors();
  };

  return (
    <div
      className="landing-page-root"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light, #fff8eb)",
        paddingBottom: 100,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ───────────────────── TICKER BAND ───────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "var(--color-dark, #231e25)",
          padding: "5px 0",
          borderBottom: "2px solid #000",
          zIndex: 40,
        }}
      >
        <TickerStrip
          items={[
            "VERIFIED INDUSTRY PARTNERS",
            "EXHIBITOR DIRECTORY · 2026",
            "BOOTH LOCATIONS LIVE",
            "PRODUCT SHOWCASES · COMPANY PROFILES",
          ]}
          color="var(--color-purple-mimosa, #a67eff)"
          duration={26}
          fontSize={11}
        />
      </div>

      <main
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "130px clamp(16px, 4vw, 56px) 60px clamp(16px, 4vw, 56px)",
        }}
      >
        {/* ───────────────────── HEADER ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginBottom: 40,
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ position: "relative", maxWidth: 720 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--color-purple-mimosa, #a67eff)",
                color: "#ffffff",
                padding: "4px 14px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                marginBottom: 12,
                border: "1.5px solid #000",
                boxShadow: "2px 2px 0 #000",
                transform: "rotate(-0.8deg)",
              }}
            >
              <PulseDot color="#fff" glow={false} size={6} />
              <span>VERIFIED INDUSTRY PARTNERS</span>
            </div>

            <h1
              className="style-display"
              style={{
                fontSize: "clamp(48px, 7vw, 92px)",
                color: "var(--color-dark, #231e25)",
                margin: 0,
                lineHeight: 0.9,
                letterSpacing: 2,
              }}
            >
              EXHIBITOR{" "}
              <span style={{ color: "var(--color-primary, #ff3e33)" }}>DIRECTORY</span>
            </h1>

            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 16,
                color: "#4b5563",
                marginTop: 12,
                maxWidth: 620,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Explore verified exhibitors, innovative product showcases, and booth
              locations across all trade shows.
            </p>
          </div>

          <RotatingBadge
            text="LIVE DIRECTORY"
            size={108}
            bg="var(--color-kiwi, #abf139)"
            color="#000"
            duration={16}
            tilt={6}
          />
        </motion.div>

        {/* ───────────────────── SEARCH + FILTER BAR ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 44,
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
            padding: "clamp(18px, 3vw, 26px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <ShineSweep duration={1.6} delay={0.2} opacity={0.22} />
          <TickStrip color="rgba(0,0,0,0.35)" gap={14} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-display)",
              fontSize: 18,
              letterSpacing: 0.6,
              color: "var(--color-dark, #231e25)",
            }}
          >
            <span style={{ width: 8, height: 8, background: "var(--color-primary, #ff3e33)", border: "1.5px solid #000", display: "inline-block" }} />
            SEARCH & FILTER DIRECTORY
            <span style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg, #000 0 4px, transparent 4px 10px)", opacity: 0.3 }} />
          </div>

          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", gap: 10, maxWidth: 720, width: "100%" }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="text"
                placeholder="Search by company name, products, or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 18px",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  outline: "none",
                  backgroundColor: "#ffffff",
                  boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 900,
                  color: "var(--color-purple-mimosa, #a67eff)",
                  letterSpacing: 1,
                  pointerEvents: "none",
                }}
              >
                ⌕
              </span>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -3, boxShadow: "6px 6px 0px var(--color-primary, #ff3e33)" }}
              whileTap={{ y: 1, boxShadow: "3px 3px 0px #000" }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              style={{
                backgroundColor: "var(--color-dark, #231e25)",
                color: "#ffffff",
                border: "2.5px solid #000",
                padding: "0 26px",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                letterSpacing: 1,
                cursor: "pointer",
                boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <PulseDot color="var(--color-primary, #ff3e33)" size={7} glow={false} />
              SEARCH
            </motion.button>
          </form>

          {/* Categories */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((c, i) => {
              const active = selectedCategory === c;
              return (
                <motion.button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  whileHover={{ y: -3, rotate: active ? 0 : i % 2 === 0 ? -1.5 : 1.5 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "8px 18px",
                    borderRadius: 30,
                    backgroundColor: active ? "var(--color-dark, #231e25)" : "#ffffff",
                    color: active
                      ? "var(--color-light, #fff8eb)"
                      : "var(--color-dark, #231e25)",
                    border: "2px solid var(--color-dark, #231e25)",
                    boxShadow: active
                      ? "3px 3px 0px var(--color-primary, #ff3e33)"
                      : "2px 2px 0px var(--color-dark, #231e25)",
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    letterSpacing: 0.6,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {active && <ShineSweep duration={1.2} delay={0} opacity={0.35} />}
                  {active && <PulseDot color="var(--color-primary, #ff3e33)" size={7} glow={false} />}
                  {c}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ───────────────────── ERROR ───────────────────── */}
        {error && (
          <motion.div
            initial={{ x: -8 }}
            animate={{ x: [0, -4, 4, -4, 0] }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundColor: "#fee2e2",
              border: "2.5px solid var(--color-primary, #ff3e33)",
              boxShadow: "4px 4px 0px var(--color-primary, #ff3e33)",
              padding: "14px 18px",
              marginBottom: 24,
              fontWeight: 700,
              fontFamily: "'Satoshi', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} />
            Notice: {error}
          </motion.div>
        )}

        {/* ───────────────────── GRID / LOADING / EMPTY ───────────────────── */}
        {loading ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "60px 40px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
            <Scanline color="rgba(166,126,255,0.35)" height={70} />
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                border: "4px solid var(--color-dark, #231e25)",
                borderTopColor: "var(--color-purple-mimosa, #a67eff)",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                margin: 0,
                letterSpacing: 0.5,
                color: "var(--color-dark, #231e25)",
              }}
            >
              LOADING EXHIBITOR SHOWCASE...
            </p>
            <TickerStrip
              items={["FETCHING VERIFIED PARTNERS", "SYNCING COMPANY PROFILES", "VERIFYING BOOTH LOCATIONS"]}
              color="var(--color-purple-mimosa, #a67eff)"
              duration={18}
              fontSize={11}
              style={{ maxWidth: 520 }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : exhibitors.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "56px 40px",
              textAlign: "center",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
            <ShineSweep duration={1.6} delay={0.2} opacity={0.25} />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--color-selective-yellow, #feb804)",
                color: "#000",
                padding: "6px 14px",
                borderRadius: 30,
                border: "2px solid #000",
                boxShadow: "3px 3px 0 #000",
                fontFamily: "var(--font-display)",
                fontSize: 16,
                letterSpacing: 1,
                marginBottom: 18,
              }}
            >
              <PulseDot color="#000" glow={false} size={7} />
              NO EXHIBITORS FOUND
            </div>
            <p style={{ margin: 0, fontSize: 16, color: "#4b5563" }}>
              No exhibitors matched your search. Try a different keyword or category.
            </p>
          </div>
        ) : (
          <>
            {/* Result count strip */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 22,
                paddingBottom: 12,
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
                  {String(exhibitors.length).padStart(2, "0")}
                </span>
                PARTNER{exhibitors.length !== 1 ? "S" : ""} LISTED
              </span>

              <TickerStrip
                items={["EXHIBITOR DIRECTORY", "VERIFIED COMPANIES", "LIVE BOOTH DATA"]}
                color="var(--color-purple-mimosa, #a67eff)"
                duration={20}
                fontSize={10}
                style={{ maxWidth: 400 }}
              />
            </div>

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                gap: "32px 28px",
              }}
            >
              <AnimatePresence mode="popLayout">
                {exhibitors.map((ex, idx) => {
                  const isHovered = hoveredCard === (ex._id || idx);
                  const accentColors = [
                    "var(--color-purple-mimosa, #a67eff)",
                    "var(--color-primary, #ff3e33)",
                    "var(--color-kiwi, #abf139)",
                    "var(--color-selective-yellow, #feb804)",
                    "var(--color-cerulean, #14a6ea)",
                  ];
                  const accent = accentColors[idx % accentColors.length];

                  return (
                    <motion.div
                      key={ex._id || idx}
                      layout
                      onMouseEnter={() => setHoveredCard(ex._id || idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 24,
                        delay: idx * 0.06,
                      }}
                      whileHover={{
                        y: -8,
                        boxShadow: `10px 10px 0px ${accent}`,
                        rotate: -0.4,
                      }}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "3px solid var(--color-dark, #231e25)",
                        boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 320,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
                      <ShineSweep duration={1.7} delay={idx * 0.05} opacity={0.22} />

                      {/* Accent bar on top */}
                      <div
                        style={{
                          height: 6,
                          backgroundColor: accent,
                          borderBottom: "2px solid var(--color-dark, #231e25)",
                          position: "relative",
                        }}
                      />

                      {/* Card body */}
                      <div style={{ padding: "22px 22px 18px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

                        {/* Top row: category + booth */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: accent,
                              color: accent === "var(--color-kiwi, #abf139)" || accent === "var(--color-selective-yellow, #feb804)" ? "#000" : "#fff",
                              padding: "4px 10px",
                              borderRadius: 3,
                              fontSize: 11,
                              fontWeight: 800,
                              textTransform: "uppercase",
                              border: "1.5px solid #000",
                              letterSpacing: 0.5,
                            }}
                          >
                            {ex.category || "General"}
                          </span>

                          {ex.boothNumber ? (
                            <span
                              style={{
                                backgroundColor: "var(--color-dark, #231e25)",
                                color: "var(--color-light, #fff8eb)",
                                padding: "4px 10px",
                                borderRadius: 3,
                                fontSize: 11,
                                fontWeight: 800,
                                fontFamily: "var(--font-display)",
                                letterSpacing: 0.6,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <PulseDot color="var(--color-primary, #ff3e33)" size={6} glow={false} />
                              BOOTH {ex.boothNumber}
                            </span>
                          ) : (
                            <span
                              style={{
                                backgroundColor: "var(--color-selective-yellow, #feb804)",
                                color: "#000",
                                padding: "4px 10px",
                                borderRadius: 3,
                                fontSize: 11,
                                fontWeight: 800,
                                border: "1.5px solid #000",
                              }}
                            >
                              SPACE PENDING
                            </span>
                          )}
                        </div>

                        {/* Logo + company */}
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                          <motion.div
                            animate={{ rotate: isHovered ? -3 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 6,
                              border: "2.5px solid #000",
                              backgroundColor: "var(--color-light, #fff8eb)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                              boxShadow: "3px 3px 0 #000",
                              position: "relative",
                            }}
                          >
                            {ex.logo ? (
                              <img
                                src={
                                  ex.logo.startsWith("http")
                                    ? ex.logo
                                    : `${BASE}${ex.logo.startsWith("/") ? "" : "/"}${ex.logo}`
                                }
                                alt={ex.company}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 900,
                                  fontFamily: "var(--font-display)",
                                  color: "var(--color-dark, #231e25)",
                                  letterSpacing: 1,
                                }}
                              >
                                EXPO
                              </span>
                            )}
                          </motion.div>

                          <div style={{ minWidth: 0 }}>
                            <h3
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 28,
                                margin: 0,
                                lineHeight: 0.95,
                                letterSpacing: 0.6,
                                color: "var(--color-dark, #231e25)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {ex.company || ex.name}
                            </h3>
                            {ex.name && ex.company && ex.name !== ex.company && (
                              <span
                                style={{
                                  fontFamily: "'Satoshi', sans-serif",
                                  fontSize: 12,
                                  color: "#6b7280",
                                  fontWeight: 700,
                                }}
                              >
                                Rep: {ex.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 14,
                            color: "#4b5563",
                            lineHeight: 1.5,
                            margin: 0,
                            fontWeight: 500,
                            flex: 1,
                          }}
                        >
                          {(
                            ex.description ||
                            ex.products ||
                            "Showcasing industry solutions and technological innovations."
                          ).substring(0, 130)}
                          {(ex.description || ex.products || "").length > 130 ? "..." : ""}
                        </p>
                      </div>

                      {/* Card footer */}
                      <div
                        style={{
                          borderTop: "2px dashed var(--color-dark, #231e25)",
                          padding: "14px 22px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "rgba(0,0,0,0.03)",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#6b7280",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            letterSpacing: 0.6,
                            textTransform: "uppercase",
                          }}
                        >
                          <PulseDot color="var(--color-kiwi, #abf139)" size={7} glow={false} />
                          Verified Partner
                        </span>

                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        >
                          <Link
                            to={`/exhibitors/${ex._id}`}
                            style={{
                              backgroundColor: "var(--color-dark, #231e25)",
                              color: "var(--color-light, #fff8eb)",
                              border: "2px solid #000",
                              boxShadow: "2px 2px 0 #000",
                              padding: "8px 16px",
                              borderRadius: 3,
                              textDecoration: "none",
                              fontFamily: "var(--font-display)",
                              fontSize: 17,
                              letterSpacing: 0.8,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            VIEW PROFILE
                            <span style={{ fontSize: 12 }}>→</span>
                          </Link>
                        </motion.div>
                      </div>

                      {/* Rotating badge on first verified exhibitor */}
                      {idx === 0 && (
                        <RotatingBadge
                          text="FEATURED"
                          size={78}
                          bg="var(--color-selective-yellow, #feb804)"
                          color="#000"
                          top={-20}
                          right={-20}
                          duration={15}
                          tilt={-8}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* ───────────────────── BOTTOM CTA ───────────────────── */}
        {!loading && exhibitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: 60,
              backgroundColor: "var(--color-purple-mimosa, #a67eff)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
              padding: "clamp(24px, 4vw, 40px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CornerBrackets color="#fff" inset={10} size={14} thickness={3} />
            <ShineSweep duration={1.8} delay={0.3} opacity={0.28} />
            <GrainOverlay opacity={0.15} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: 3,
                  fontSize: 11,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                <PulseDot color="#fff" glow={false} size={6} />
                WANT TO EXHIBIT AT EVENTSPHERE?
              </span>
              <h3
                className="style-display"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(30px, 4.5vw, 54px)",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 0.95,
                  letterSpacing: 1.2,
                }}
              >
                BECOME A VERIFIED PARTNER
              </h3>
              <p
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.85)",
                  margin: "8px 0 0 0",
                  fontWeight: 600,
                  maxWidth: 620,
                }}
              >
                Apply for a booth space, showcase your products, and connect with thousands of expo attendees.
              </p>
            </div>

            <motion.div
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              style={{ position: "relative", zIndex: 2 }}
            >
              <Link
                to="/register"
                style={{
                  backgroundColor: "var(--color-kiwi, #abf139)",
                  color: "#000",
                  border: "2.5px solid #000",
                  boxShadow: "4px 4px 0 #000",
                  padding: "14px 28px",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  letterSpacing: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                APPLY FOR BOOTH
                <span style={{ fontSize: 14 }}>→</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Global spin keyframe reused */}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}