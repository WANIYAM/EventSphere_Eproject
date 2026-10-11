import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { CursorImageTrail } from "../common/CursorImageTrail";

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [bracketsHovered, setBracketsHovered] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const { scrollY } = useScroll();

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 90,
    damping: 24,
    mass: 0.2,
  });

  const backgroundColor = useTransform(
    smoothScrollY,
    [0, 320],
    ["rgb(255, 62, 51)", "rgb(35, 30, 37)"]
  );

  const heroControlsOpacity = useTransform(smoothScrollY, [0, 80], [1, 0]);

  // Tags appear on scroll down
  const tagOpacity = useTransform(smoothScrollY, [50, 160], [0, 1]);
  const tagScale = useTransform(smoothScrollY, [50, 180], [0.5, 1]);
  const leftTagOffset = useTransform(smoothScrollY, [50, 200], [-100, 0]);
  const rightTagOffset = useTransform(smoothScrollY, [50, 200], [100, 0]);

  const scrollToGallery = () => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      ref={heroRef}
      style={{
        backgroundColor,
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "0 24px",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 120, 100, 0.35) 0%, rgba(255,62,51,0) 70%)",
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <CursorImageTrail containerRef={heroRef} />

      {/* Main Headline: REVOLUTIONIZING THE EXPO EXPERIENCE */}
      <motion.div
        initial={{ filter: "blur(14px)", opacity: 0, scale: 0.94 }}
        animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "var(--color-light)",
          zIndex: 5,
          userSelect: "none",
          marginTop: -20,
        }}
      >
        <div
          onMouseEnter={() => setBracketsHovered(true)}
          onMouseLeave={() => setBracketsHovered(false)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(12px, 2.5vw, 36px)",
            cursor: "pointer",
          }}
        >
          <motion.span
            animate={{
              x: bracketsHovered ? -16 : 0,
              color: bracketsHovered ? "var(--color-kiwi)" : "var(--color-light)",
              scale: bracketsHovered ? 1.08 : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="style-display"
            style={{ fontSize: "clamp(60px, 11vw, 150px)", lineHeight: 0.9 }}
          >
            &#123;
          </motion.span>

          <span className="style-display" style={{ fontSize: "clamp(60px, 11vw, 150px)", color: "var(--color-light)", lineHeight: 0.9 }}>
            REVOLUTIONIZING
          </span>

          <motion.span
            animate={{
              x: bracketsHovered ? 16 : 0,
              color: bracketsHovered ? "var(--color-kiwi)" : "var(--color-light)",
              scale: bracketsHovered ? 1.08 : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="style-display"
            style={{ fontSize: "clamp(60px, 11vw, 150px)", lineHeight: 0.9 }}
          >
            &#125;
          </motion.span>
        </div>

        <div style={{ position: "relative", display: "inline-block", marginTop: 4 }}>
          <h1
            className="style-display"
            style={{
              fontSize: "clamp(64px, 12vw, 168px)",
              color: "var(--color-light)",
              lineHeight: 0.88,
              margin: 0,
              textShadow: "0 6px 30px rgba(0,0,0,0.15)",
            }}
          >
            EXPO MANAGEMENT
          </h1>

          {/* Left Tag: Role Differentiation from SRS */}
          <motion.div
            style={{
              position: "absolute",
              top: "32%",
              left: "-8%",
              x: leftTagOffset,
              opacity: tagOpacity,
              scale: tagScale,
              rotate: -15,
              backgroundColor: "var(--color-vista-blue)",
              border: "2px solid var(--color-dark)",
              boxShadow: "3px 3px 0px var(--color-dark)",
              padding: "6px 20px",
              borderRadius: 40,
              zIndex: 10,
              cursor: "default",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(14px, 1.6vw, 22px)",
                color: "var(--color-dark)",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              ORGANIZERS • EXHIBITORS • ATTENDEES
            </span>
          </motion.div>

          {/* Right Tag: Core Value from SRS */}
          <motion.div
            style={{
              position: "absolute",
              top: "20%",
              right: "-12%",
              x: rightTagOffset,
              opacity: tagOpacity,
              scale: tagScale,
              rotate: 15,
              backgroundColor: "var(--color-cerulean)",
              border: "2px solid var(--color-dark)",
              boxShadow: "3px 3px 0px var(--color-dark)",
              padding: "6px 20px",
              borderRadius: 40,
              zIndex: 10,
              cursor: "default",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(14px, 1.6vw, 22px)",
                color: "var(--color-light)",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              REAL-TIME BOOTH ALLOCATION & SCHEDULING
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Poster Metadata (Bottom Left) */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 28,
          left: 32,
          opacity: heroControlsOpacity,
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontFamily: "'Satoshi', sans-serif",
          color: "rgba(255, 248, 235, 0.85)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-kiwi)" }} />
          <span>EVENTSPHERE MANAGEMENT SYSTEM</span>
        </div>
        <span style={{ opacity: 0.65, fontSize: 11 }}>ENTERPRISE EXPOS & TRADE SHOWS</span>
      </motion.div>

      {/* Center Bottom: "Scroll to Explore" */}
      <motion.button
        onClick={scrollToGallery}
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: heroControlsOpacity,
          zIndex: 6,
          backgroundColor: "var(--color-dark)",
          color: "var(--color-light)",
          border: "2px solid #000000",
          boxShadow: "3px 3px 0px #000000",
          padding: "8px 20px",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          userSelect: "none",
        }}
        whileHover={{ scale: 1.05, y: -3, boxShadow: "5px 5px 0px #000000" }}
        whileTap={{ scale: 0.96 }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 12 }}>
          {[0.5, 1, 0.4, 0.85].map((h, i) => (
            <motion.span
              key={i}
              animate={{ height: ["3px", `${h * 12}px`, "3px"] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              style={{ width: 2.5, backgroundColor: "var(--color-kiwi)", borderRadius: 1 }}
            />
          ))}
        </div>

        <span style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 1 }}>
          EXPLORE EXPO SUITE
        </span>

        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-flex" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.span>
      </motion.button>
    </motion.section>
  );
};
