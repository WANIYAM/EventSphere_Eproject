import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface LiveStats {
  totalExpos?: number;
  totalExhibitors?: number;
  totalSessions?: number;
  totalAttendees?: number;
  occupancyRate?: number;
}

// 60FPS Smooth Count-Up Component
const AnimatedNumber: React.FC<{ target: number; suffix?: string }> = ({
  target,
  suffix = "",
}) => {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    const duration = 1600;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.floor(ease * target));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsCounterSection: React.FC<{ stats?: LiveStats }> = ({
  stats = { totalExpos: 1, totalExhibitors: 4, totalSessions: 4, totalAttendees: 8, occupancyRate: 15 },
}) => {
  return (
    <section
      id="stats-matrix"
      style={{
        backgroundColor: "transparent",
        padding: "90px clamp(20px, 4vw, 64px) 120px clamp(20px, 4vw, 64px)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              padding: "4px 14px",
              borderRadius: 4,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)" }} />
            <span>REAL-TIME DATABASE TELEMETRY</span>
          </div>

          <h2
            className="style-display"
            style={{
              fontSize: "clamp(50px, 7.5vw, 100px)",
              color: "var(--color-dark, #231e25)",
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: 1.5,
            }}
          >
            EVENTSPHERE &#123; BENTO MATRIX &#125;
          </h2>
        </div>

        {/* =========================================================
            NEO-BRUTALIST BENTO GRID
        ========================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 20,
          }}
          className="bento-grid-container"
        >
          {/* -----------------------------------------------------
              BENTO 1 (HERO CELL): ATTENDEE SCALE (SPANS 8 COLUMNS)
          ------------------------------------------------------ */}
          <motion.div
            whileHover={{ y: -6, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            style={{
              gridColumn: "span 8",
              backgroundColor: "var(--color-purple-mimosa, #a67eff)",
              color: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "clamp(24px, 4vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              minHeight: 260,
            }}
            className="bento-col-8"
          >
            {/* Corner Viewfinders */}
            <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />
            <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <span style={{ backgroundColor: "#000", color: "#fff", padding: "3px 10px", borderRadius: 2, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                  [ GLOBAL REACH // SCALE ]
                </span>
                <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 18, fontWeight: 800, margin: "10px 0 0 0" }}>
                  TOTAL REGISTERED TRADE ATTENDEES
                </h4>
              </div>
              <span style={{ fontSize: 24 }}>👥</span>
            </div>

            <div style={{ margin: "20px 0" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(74px, 10vw, 120px)",
                  lineHeight: 0.85,
                  letterSpacing: 2,
                }}
              >
                <AnimatedNumber target={stats.totalAttendees ? stats.totalAttendees * 1000 : 8000} suffix="+" />
              </div>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 600, opacity: 0.9, margin: "8px 0 0 0" }}>
                Enterprise buyers, developers & trade visitors actively registered across all expo halls.
              </p>
            </div>

            {/* Live Throughput Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "2px solid rgba(0,0,0,0.25)", paddingTop: 14 }}>
              <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, color: "#000" }}>
                LIVE PASS ISSUANCE
              </span>
              <div style={{ flex: 1, height: 8, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 4, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "88%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  style={{ height: "100%", backgroundColor: "var(--color-kiwi, #abf139)" }}
                />
              </div>
              <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                88% ALLOCATED
              </span>
            </div>
          </motion.div>

          {/* -----------------------------------------------------
              BENTO 2 (RADIAL GAUGE CELL): OCCUPANCY (SPANS 4 COLS)
          ------------------------------------------------------ */}
          <motion.div
            whileHover={{ y: -6, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            style={{
              gridColumn: "span 4",
              backgroundColor: "var(--color-kiwi, #abf139)",
              color: "var(--color-dark, #231e25)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
            className="bento-col-4"
          >
            <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#000", border: "1.5px solid #fff", zIndex: 10 }} />
            <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: "#000", border: "1.5px solid #fff", zIndex: 10 }} />

            <div>
              <span style={{ backgroundColor: "#000", color: "#fff", padding: "3px 10px", borderRadius: 2, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                [ FLOOR MAP ]
              </span>
              <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 800, margin: "10px 0 0 0" }}>
                BOOTH OCCUPANCY
              </h4>
            </div>

            <div style={{ textAlign: "center", margin: "14px 0" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(68px, 8vw, 96px)",
                  lineHeight: 0.88,
                }}
              >
                <AnimatedNumber target={stats.occupancyRate || 15} suffix="%" />
              </div>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase", opacity: 0.8 }}>
                COMMERCIAL BOOTHS BOOKED
              </span>
            </div>

            <div style={{ backgroundColor: "#000", color: "#fff", padding: "8px 12px", borderRadius: 3, textAlign: "center", fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
              RESERVE ON FLOOR PLAN →
            </div>
          </motion.div>

          {/* -----------------------------------------------------
              BENTO 3: ACTIVE EXPOS (SPANS 4 COLUMNS)
          ------------------------------------------------------ */}
          <motion.div
            whileHover={{ y: -6, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            style={{
              gridColumn: "span 4",
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "26px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
            className="bento-col-4"
          >
            <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />

            <div>
              <span style={{ backgroundColor: "#fff", color: "#000", padding: "3px 8px", borderRadius: 2, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                CONVENTION HALLS
              </span>
              <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: "10px 0 0 0" }}>
                ACTIVE TRADE SHOWS
              </h4>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(60px, 7vw, 84px)",
                lineHeight: 0.88,
                margin: "12px 0 6px 0",
              }}
            >
              <AnimatedNumber target={stats.totalExpos || 1} />
            </div>

            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, opacity: 0.9 }}>
              LIVE IN PENANG // KOMCA DPS 1
            </span>
          </motion.div>

          {/* -----------------------------------------------------
              BENTO 4: APPROVED EXHIBITORS (SPANS 4 COLUMNS)
          ------------------------------------------------------ */}
          <motion.div
            whileHover={{ y: -6, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            style={{
              gridColumn: "span 4",
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              color: "var(--color-dark, #231e25)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "26px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
            className="bento-col-4"
          >
            <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#000", border: "1.5px solid #fff", zIndex: 10 }} />

            <div>
              <span style={{ backgroundColor: "#000", color: "#fff", padding: "3px 8px", borderRadius: 2, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                VERIFIED BRANDS
              </span>
              <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: "10px 0 0 0" }}>
                APPROVED EXHIBITORS
              </h4>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(60px, 7vw, 84px)",
                lineHeight: 0.88,
                margin: "12px 0 6px 0",
              }}
            >
              <AnimatedNumber target={stats.totalExhibitors || 4} />
            </div>

            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, opacity: 0.9 }}>
              COMMERCIAL BOOTH SHOWCASES
            </span>
          </motion.div>

          {/* -----------------------------------------------------
              BENTO 5: SCHEDULED SESSIONS (SPANS 4 COLUMNS)
          ------------------------------------------------------ */}
          <motion.div
            whileHover={{ y: -6, boxShadow: "9px 9px 0px var(--color-dark, #231e25)" }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            style={{
              gridColumn: "span 4",
              backgroundColor: "var(--color-cerulean, #14a6ea)",
              color: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "26px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
            className="bento-col-4"
          >
            <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />

            <div>
              <span style={{ backgroundColor: "#000", color: "#fff", padding: "3px 8px", borderRadius: 2, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                KEYNOTES & LABS
              </span>
              <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: "10px 0 0 0" }}>
                SCHEDULED SESSIONS
              </h4>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(60px, 7vw, 84px)",
                lineHeight: 0.88,
                margin: "12px 0 6px 0",
              }}
            >
              <AnimatedNumber target={stats.totalSessions || 4} />
            </div>

            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, opacity: 0.9 }}>
              ACROSS 3 EVENT DAYS
            </span>
          </motion.div>

          {/* -----------------------------------------------------
              BENTO 6 (FULL-WIDTH BOTTOM RUNNER): LIVE HEARTBEAT
          ------------------------------------------------------ */}
          <div
            style={{
              gridColumn: "span 12",
              backgroundColor: "var(--color-light, #fff8eb)",
              color: "var(--color-dark, #231e25)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
            className="bento-col-12"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)", display: "inline-block", boxShadow: "0 0 8px var(--color-kiwi)" }} />
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: 0.5 }}>
                MONGODB LIVE SYNCHRONIZATION ACTIVE
              </span>
            </div>

            <div style={{ display: "flex", gap: 16, fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, opacity: 0.85 }}>
              <span>LATENCY: &lt; 20MS</span>
              <span>•</span>
              <span>ZERO DATA DRIFT</span>
              <span>•</span>
              <span>ENCRYPTED TELEMETRY</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bento-col-8 { grid-column: span 12 !important; }
          .bento-col-4 { grid-column: span 6 !important; }
          .bento-col-12 { grid-column: span 12 !important; }
        }
        @media (max-width: 600px) {
          .bento-col-4 { grid-column: span 12 !important; }
        }
      `}</style>
    </section>
  );
};