import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Star: React.FC<{ color?: string }> = ({ color = "#231e25" }) => (
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    width="60" height="60" viewBox="0 0 24 24" style={{ margin: "0 24px", flexShrink: 0 }}
  >
    <path d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z" fill={color} stroke="#000" strokeWidth="1.2" />
  </motion.svg>
);

export const MarqueeCTASection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.2 });

  const rotate = useTransform(smoothProgress, [0.1, 0.7], [0, -3.2]);
  const scale = useTransform(smoothProgress, [0.1, 0.7], [1, 1.04]);

  const words = ["EVENTSPHERE", "EXPO", "EVENTSPHERE", "TRADE SHOW", "EVENTSPHERE", "BOOTH"];
  const colors = ["#ffffff", "#abf139", "#ffffff", "#feb804", "#ffffff", "#14a6ea"];

  return (
    <div ref={containerRef} style={{ position: "relative", zIndex: 5, overflow: "hidden", padding: "60px 0 30px 0", backgroundColor: "transparent" }}>
      <motion.div
        style={{
          rotate, scale, width: "115vw", marginLeft: "-7.5vw",
          backgroundColor: "var(--color-purple-mimosa)",
          borderTop: "3px solid var(--color-dark)", borderBottom: "3px solid var(--color-dark)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          padding: "36px 0", overflow: "hidden", whiteSpace: "nowrap",
          transformOrigin: "center center", willChange: "transform",
          position: "relative",
        }}
      >
        {/* Top tick strip */}
        <div style={{ position: "absolute", top: 6, left: 0, right: 0, height: 4, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 2px, transparent 2px 12px)", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, height: 4, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 2px, transparent 2px 12px)", opacity: 0.5 }} />

        <div className="marquee-track" style={{ animationDuration: "10s", display: "flex", alignItems: "center" }}>
          {[...Array(4)].flatMap((_, groupIdx) =>
            words.map((word, i) => (
              <React.Fragment key={`${groupIdx}-${i}`}>
                <span
                  className="style-display"
                  style={{
                    fontSize: "clamp(80px, 14vw, 170px)",
                    color: colors[i], letterSpacing: 3, lineHeight: 0.88, userSelect: "none",
                    textShadow: i % 2 === 1 ? "3px 3px 0 #000" : "none",
                  }}
                >
                  {word}
                </span>
                <Star color={i % 2 === 0 ? "#231e25" : "#ffffff"} />
              </React.Fragment>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};