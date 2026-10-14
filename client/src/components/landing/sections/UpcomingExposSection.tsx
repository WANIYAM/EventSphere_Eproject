import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ExpoCardProps {
  expo: any;
  index: number;
  bg: string;
  scatterProgress: any;
  isManualStacked: boolean;
}

// Vector offsets to cluster all cards at the center when stacked
const STACK_CONFIGS = [
  { startX: "104%", startY: "54%", rot: -7, zIndex: 6 },  // Card 0 (Col 1, Row 1)
  { startX: "0%", startY: "54%", rot: 4, zIndex: 5 },    // Card 1 (Col 2, Row 1)
  { startX: "-104%", startY: "54%", rot: -4, zIndex: 4 }, // Card 2 (Col 3, Row 1)
  { startX: "104%", startY: "-54%", rot: 6, zIndex: 3 },  // Card 3 (Col 1, Row 2)
  { startX: "0%", startY: "-54%", rot: -6, zIndex: 2 },   // Card 4 (Col 2, Row 2)
  { startX: "-104%", startY: "-54%", rot: 3, zIndex: 1 }, // Card 5 (Col 3, Row 2)
];

const ExpoCredentialBadge: React.FC<ExpoCardProps> = ({
  expo,
  index,
  bg,
  scatterProgress,
  isManualStacked,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cfg = STACK_CONFIGS[index % STACK_CONFIGS.length];

  // As the section scrolls from entering the screen to center, cards scatter outwards into the grid
  const x = useTransform(scatterProgress, [0.05, 0.85], [cfg.startX, "0%"]);
  const y = useTransform(scatterProgress, [0.05, 0.85], [cfg.startY, "0%"]);
  const rotate = useTransform(scatterProgress, [0.05, 0.85], [cfg.rot, 0]);
  const scale = useTransform(scatterProgress, [0.05, 0.85], [0.94, 1]);

  const isDark = bg === "var(--color-purple-mimosa, #a67eff)";

  return (
    <motion.div
      style={{
        x: isManualStacked ? cfg.startX : x,
        y: isManualStacked ? cfg.startY : y,
        rotate: isManualStacked ? cfg.rot : rotate,
        scale: isManualStacked ? 0.94 : scale,
        zIndex: isHovered ? 40 : cfg.zIndex,
        position: "relative",
        width: "100%",
        willChange: "transform",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        style={{
          backgroundColor: bg,
          color: isDark ? "#ffffff" : "var(--color-dark, #231e25)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: isHovered
            ? "10px 10px 0px var(--color-dark, #231e25)"
            : "5px 5px 0px var(--color-dark, #231e25)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 340, // Proportional height that fits cleanly
          position: "relative",
          overflow: "hidden",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Lanyard Strap Cutout Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 44,
            height: 7,
            backgroundColor: "var(--color-dark, #231e25)",
            borderRadius: "0 0 4px 4px",
            zIndex: 20,
          }}
        />

        {/* 4 Corner Viewfinder Handles */}
        <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#ffffff", border: "1.5px solid #000", zIndex: 20 }} />
        <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: "#ffffff", border: "1.5px solid #000", zIndex: 20 }} />
        <div style={{ position: "absolute", bottom: -5, left: -5, width: 9, height: 9, backgroundColor: "#ffffff", border: "1.5px solid #000", zIndex: 20 }} />
        <div style={{ position: "absolute", bottom: -5, right: -5, width: 9, height: 9, backgroundColor: "#ffffff", border: "1.5px solid #000", zIndex: 20 }} />

        {/* =========================================================
            CARD CONTENT
        ========================================================== */}
        <div style={{ padding: "24px 20px 16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Top Row: Theme Pill + Index */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: 3,
                fontSize: 11,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              {expo.theme || "TRADE SHOW"}
            </span>

            <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, opacity: 0.8 }}>
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 2.8vw, 38px)",
              lineHeight: 0.92,
              margin: "2px 0 0 0",
              letterSpacing: 0.8,
            }}
          >
            {expo.title}
          </h3>

          {/* Location & Dates */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            <span>Location: {expo.location || "To be announced"}</span>
            <span>Dates: {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</span>
          </div>

          {/* Description */}
          {expo.description && (
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, lineHeight: 1.45, margin: 0, opacity: 0.95, fontWeight: 500 }}>
              {expo.description.substring(0, 115)}...
            </p>
          )}
        </div>

        {/* Perforated Action Stub */}
        <div
          style={{
            borderTop: "2px dashed var(--color-dark, #231e25)",
            padding: "12px 18px",
            backgroundColor: "rgba(0,0,0,0.06)",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Link
            to="/register?role=attendee"
            style={{
              flex: 1,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              border: "2px solid #000000",
              boxShadow: "2px 2px 0px #000000",
              padding: "9px",
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontSize: 17,
              textDecoration: "none",
              letterSpacing: 0.5,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>REGISTER AS ATTENDEE</span>
          </Link>

          <Link
            to="/register?role=exhibitor"
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "2px solid #000000",
              boxShadow: "2px 2px 0px #000000",
              padding: "9px",
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontSize: 17,
              textDecoration: "none",
              letterSpacing: 0.5,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            APPLY TO EXHIBIT
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const UpcomingExposSection: React.FC<{ expos?: any[] }> = ({ expos = [] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isManualStacked, setIsManualStacked] = useState(false);

  // Scroll tracking as the section enters the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"], // Triggers as section enters view
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.25,
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
    <section
      id="expos"
      ref={sectionRef}
      style={{
        backgroundColor: "transparent",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
        minHeight: "100vh",
        padding: "100px clamp(20px, 4vw, 56px) 140px clamp(20px, 4vw, 56px)", // Natural height with proper padding
      }}
    >
      <div style={{ maxWidth: 1240, width: "100%", margin: "0 auto" }}>
        
        {/* Section Header with Manual Toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--color-primary, #ff3e33)",
                color: "#ffffff",
                padding: "4px 14px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              <span>EXPO EVENTS // EVENT DETAILS</span>
            </div>

            <h2
              className="style-display"
              style={{
                fontSize: "clamp(48px, 6.5vw, 92px)",
                color: "var(--color-dark, #231e25)",
                margin: 0,
                lineHeight: 0.9,
                letterSpacing: 1.5,
              }}
            >
              EXPLORE &#123; EXPOS & TRADE SHOWS &#125;
            </h2>
          </div>

          {/* Interactive Toggle Button */}
          <motion.button
            onClick={() => setIsManualStacked(!isManualStacked)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: isManualStacked ? "var(--color-primary, #ff3e33)" : "var(--color-dark, #231e25)",
              color: "#ffffff",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              padding: "8px 18px",
              borderRadius: 40,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{isManualStacked ? "SCATTER TO GRID" : "STACK DECK"}</span>
          </motion.button>
        </div>

        {/* =========================================================
            THE SCATTER GRID (Cards burst out from center on scroll)
        ========================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px 28px",
            position: "relative",
            width: "100%",
          }}
          className="scatter-grid"
        >
          {expos.map((expo, idx) => (
            <ExpoCredentialBadge
              key={expo._id || idx}
              expo={expo}
              index={idx}
              bg={cardPalettes[idx % cardPalettes.length]}
              scatterProgress={smoothProgress}
              isManualStacked={isManualStacked}
            />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .scatter-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
};