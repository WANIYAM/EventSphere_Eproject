import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const MarqueeCTASection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.2,
  });

  const rotate = useTransform(smoothProgress, [0.1, 0.7], [0, -3.2]);
  const scale = useTransform(smoothProgress, [0.1, 0.7], [1, 1.04]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        zIndex: 5,
        overflow: "hidden",
        padding: "60px 0 30px 0",
        backgroundColor: "transparent",
      }}
    >
      <motion.div
        style={{
          rotate,
          scale,
          width: "115vw",
          marginLeft: "-7.5vw",
          backgroundColor: "var(--color-purple-mimosa)",
          borderTop: "3px solid var(--color-dark)",
          borderBottom: "3px solid var(--color-dark)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          padding: "36px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <div className="marquee-track" style={{ animationDuration: "10s" }}>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="style-display"
              style={{
                fontSize: "clamp(80px, 14vw, 170px)",
                color: "#ffffff",
                letterSpacing: 3,
                marginRight: 40,
                lineHeight: 0.88,
                userSelect: "none",
              }}
            >
              EVENTSPHERE
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
