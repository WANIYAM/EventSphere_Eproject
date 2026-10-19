import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { RollingTextButton } from "../common/RollingTextButton";

const ScallopEdge: React.FC<{ side: "left" | "right"; count?: number }> = ({ side, count = 12 }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      [side]: -9,
      width: 18,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      zIndex: 10,
      pointerEvents: "none",
    }}
  >
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "rgb(255, 62, 51)",
        }}
      />
    ))}
  </div>
);

const Barcode: React.FC<{ color?: string }> = ({ color = "#231e25" }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 38 }}>
    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2].map((width, index) => (
      <motion.div
        key={index}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.012, duration: 0.25 }}
        style={{
          width,
          height: `${60 + (index % 3) * 15}%`,
          background: color,
          transformOrigin: "bottom",
        }}
      />
    ))}
  </div>
);

const StampSeal: React.FC = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
    style={{
      position: "absolute",
      top: "50%",
      right: 28,
      y: "-50%",
      width: 108,
      height: 108,
      borderRadius: "50%",
      border: "3px dashed var(--color-primary)",
      opacity: 0.35,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-primary)",
      fontFamily: "var(--font-display)",
      fontSize: 14,
      letterSpacing: 1,
      zIndex: 0,
    }}
  >
    EVENTSPHERE ★ 2026
  </motion.div>
);

export const TicketSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3,
  });

  const stubX = useTransform(smoothProgress, [0.3, 0.9], [0, -18]);
  const mainX = useTransform(smoothProgress, [0.3, 0.9], [0, 18]);
  const cardsY = useTransform(smoothProgress, [0.1, 0.8], [90, 0]);

  return (
    <section
      id="tickets"
      ref={containerRef}
      style={{
        backgroundColor: "transparent",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px clamp(20px, 4vw, 56px) 140px clamp(20px, 4vw, 56px)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 28,
            marginBottom: "clamp(48px, 6vw, 72px)",
          }}
        >
          <div>
            <h2
              className="style-display"
              style={{
                fontSize: "clamp(46px, 6.5vw, 84px)",
                color: "#ffffff",
                lineHeight: 0.9,
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              GET STARTED WITH
            </h2>
            <h2
              className="style-display"
              style={{
                fontSize: "clamp(46px, 6.5vw, 84px)",
                color: "#ffffff",
                lineHeight: 0.9,
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              &#123; EVENTSPHERE &#125;
            </h2>
          </div>

          <RollingTextButton
            buttonText="Contact EventSphere"
            bgColor="var(--color-light)"
            textColor="var(--color-dark)"
            link="#contact"
          />
        </div>

        <motion.div
          style={{
            y: cardsY,
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap",
            gap: "clamp(12px, 2vw, 24px)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* LEFT STUB */}
          <motion.div
            style={{
              x: stubX,
              position: "relative",
              width: "clamp(200px, 22vw, 240px)",
              minHeight: 440,
              backgroundColor: "var(--color-kiwi)",
              border: "3px solid var(--color-dark)",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: isHovered ? "8px 8px 0px var(--color-dark)" : "5px 5px 0px var(--color-dark)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            <ScallopEdge side="right" count={14} />

            <div>
              <h3 className="style-display" style={{ fontSize: 54, color: "#ffffff", lineHeight: 0.88, margin: 0 }}>
                EXPO
              </h3>
              <h3 className="style-display" style={{ fontSize: 54, color: "var(--color-dark)", lineHeight: 0.88, margin: 0 }}>
                REGISTRATION
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <div
                style={{
                  backgroundColor: "var(--color-dark)",
                  color: "var(--color-light)",
                  padding: "10px 6px",
                  borderRadius: 20,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: 12,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textAlign: "center",
                }}
              >
                Attendee registration
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800 }}>EVENT DETAILS</span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700, color: "var(--color-dark)" }}>
                  Dates and location set by organizer
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT TICKET BODY */}
          <motion.div
            style={{
              x: mainX,
              position: "relative",
              flex: "1 1 540px",
              maxWidth: 720,
              minHeight: 440,
              backgroundColor: "var(--color-light)",
              border: "3px solid var(--color-dark)",
              padding: "28px clamp(24px, 4vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: isHovered ? "8px 8px 0px var(--color-dark)" : "5px 5px 0px var(--color-dark)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            <ScallopEdge side="left" count={14} />
            <StampSeal />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 12,
                bottom: 12,
                left: 6,
                width: 2,
                backgroundImage: "repeating-linear-gradient(180deg, #000 0 4px, transparent 4px 10px)",
                opacity: 0.3,
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 6px)", gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-dark)" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-dark)" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-dark)" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-dark)" }} />
                </div>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--color-dark)" }}>
                  EventSphere: Unified Expo, Booth &<br />Schedule Management
                </span>
              </div>

              <div style={{ textAlign: "right" }}>
                <h4 className="style-display" style={{ fontSize: 34, color: "var(--color-dark)", margin: 0, lineHeight: 0.9 }}>
                  EXPO DATES
                </h4>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--color-dark)", margin: "4px 0 0 0" }}>
                  Set by the organizer
                </p>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#555", margin: 0 }}>
                  See the individual expo listing
                </p>
              </div>
            </div>

            <div style={{ margin: "28px 0" }}>
              <h1 className="style-display" style={{ fontSize: "clamp(64px, 9vw, 108px)", color: "var(--color-dark)", lineHeight: 0.88, letterSpacing: 1.5, margin: 0 }}>
                TRADE SHOW
              </h1>
              <h1 className="style-display" style={{ fontSize: "clamp(64px, 9vw, 108px)", color: "var(--color-dark)", lineHeight: 0.88, letterSpacing: 1.5, margin: 0 }}>
                EVENT REGISTRATION
              </h1>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18 }}>
              <div style={{ backgroundColor: "var(--color-dark)", color: "var(--color-light)", padding: "8px 20px", borderRadius: 24, fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                Organizer, exhibitor, and attendee access
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                <div>
                  <Barcode />
                  <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, letterSpacing: 2, marginTop: 4, fontWeight: 800 }}>
                    ES-2026-EXPO-0042
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800 }}>NEXT STEP</span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700, color: "var(--color-dark)" }}>
                  Choose an expo to view its details
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
