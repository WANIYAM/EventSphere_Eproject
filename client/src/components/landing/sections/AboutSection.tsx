import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import { RollingTextButton } from "../common/RollingTextButton";

// SRS Narrative Word Breakdown with Highlights
const PARAGRAPH_WORDS = [
  { text: "Overcoming" },
  { text: "traditional" },
  { text: "hurdles" },
  { text: "through" },
  { text: "automated registration,", highlight: "yellow" },
  { text: "interactive floor plans,", highlight: "blue" },
  { text: "and" },
  { text: "real-time analytics,", highlight: "salmon" },
  { text: "EventSphere" },
  { text: "Management" },
  { text: "empowers" },
  { text: "organizers," },
  { text: "exhibitors," },
  { text: "and" },
  { text: "attendees" },
  { text: "to" },
  { text: "connect" },
  { text: "seamlessly" },
  { text: "across" },
  { text: "every" },
  { text: "industry" },
  { text: "trade" },
  { text: "show." },
];

const ScrollWord: React.FC<{
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  highlight?: string;
}> = ({ children, range, progress, highlight }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <span style={{ position: "relative", display: "inline-block", marginRight: "0.26em" }}>
      <motion.span style={{ opacity, y, display: "inline-block" }}>
        {highlight ? (
          <span
            style={{
              padding: "0 6px",
              borderRadius: 4,
              backgroundColor:
                highlight === "yellow"
                  ? "rgba(254, 184, 4, 0.4)"
                  : highlight === "blue"
                  ? "rgba(148, 207, 173, 0.45)"
                  : "rgba(255, 164, 144, 0.5)",
              borderBottom: "2px solid var(--color-dark)",
              color: "var(--color-dark)",
            }}
          >
            {children}
          </span>
        ) : (
          children
        )}
      </motion.span>
    </span>
  );
};

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [badgeSpeed, setBadgeSpeed] = useState(16);

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXRaw = useTransform(mouseY, [-0.5, 0.5], [14, -14]);
  const rotateYRaw = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);

  const rotateX = useSpring(rotateXRaw, { stiffness: 350, damping: 25 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 350, damping: 25 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        backgroundColor: "transparent",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px clamp(24px, 5vw, 64px)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1240, width: "100%", margin: "0 auto" }}>
        
        {/* Title: THE VISION BEHIND { EVENTSPHERE } */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(36px, 5vw, 56px)" }}
        >
          <h2
            className="style-display"
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
              fontSize: "clamp(54px, 7.5vw, 104px)",
              color: "var(--color-dark)",
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: 1.5,
              display: "block",
            }}
          >
            THE PLATFORM
          </h2>
          <h2
            className="style-display"
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
              fontSize: "clamp(54px, 7.5vw, 104px)",
              color: "var(--color-dark)",
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: 1.5,
              display: "block",
            }}
          >
            BEHIND{" "}
            <span style={{ color: "var(--color-primary)" }}>&#123;</span>
            {" "}EVENTSPHERE{" "}
            <span style={{ color: "var(--color-primary)" }}>&#125;</span>
          </h2>
        </motion.div>

        {/* Lower Content */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "48px",
          }}
        >
          {/* Left: 3D Photo Card */}
          <div style={{ position: "relative" }}>
            <motion.div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              style={{
                perspective: 900,
                cursor: "pointer",
              }}
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  width: "clamp(250px, 24vw, 320px)",
                  height: "clamp(290px, 28vw, 370px)",
                  border: "3px solid var(--color-primary)",
                  boxShadow: "6px 6px 0px var(--color-dark)",
                  backgroundColor: "#0d0a10",
                  position: "relative",
                  overflow: "hidden",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                <div style={{ position: "absolute", top: 10, left: 10, width: 10, height: 10, borderTop: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, borderTop: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", bottom: 10, left: 10, width: 10, height: 10, borderBottom: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", bottom: 10, right: 10, width: 10, height: 10, borderBottom: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />

                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80"
                  alt="Expo floor operations"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-light)",
                    padding: "3px 8px",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  EXPO MANAGEMENT SUITE
                </div>
              </motion.div>
            </motion.div>

            {/* Rotating Stamp Badge */}
            <motion.div
              onMouseEnter={() => setBadgeSpeed(5)}
              onMouseLeave={() => setBadgeSpeed(16)}
              animate={{ rotate: 360 }}
              transition={{ duration: badgeSpeed, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                top: -36,
                right: -36,
                width: 105,
                height: 105,
                borderRadius: "50%",
                backgroundColor: "var(--color-selective-yellow)",
                border: "2.5px solid var(--color-dark)",
                boxShadow: "3px 3px 0px var(--color-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 15,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <svg viewBox="0 0 100 100" width="95" height="95">
                <path
                  id="circleTextPath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="none"
                />
                <text
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="'Satoshi', sans-serif"
                  fill="var(--color-dark)"
                  letterSpacing="1.8"
                >
                  <textPath href="#circleTextPath">
                    ★ NEXT-GEN EXPOS ★ EVENTSPHERE ★
                  </textPath>
                </text>
              </svg>
              <span style={{ position: "absolute", fontSize: 18, color: "var(--color-dark)" }}>✦</span>
            </motion.div>
          </div>

          {/* Right: Word-by-Word Scroll Reveal */}
          <div
            ref={textRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 32,
              maxWidth: 580,
              flex: "1 1 340px",
            }}
          >
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "clamp(22px, 2.3vw, 32px)",
                fontWeight: 500,
                color: "var(--color-dark)",
                lineHeight: 1.35,
                margin: 0,
                letterSpacing: "-0.015em",
              }}
            >
              {PARAGRAPH_WORDS.map((w, i) => {
                const start = i / PARAGRAPH_WORDS.length;
                const end = Math.min(start + 0.1, 1);

                return (
                  <ScrollWord
                    key={i}
                    range={[start, end]}
                    progress={textProgress}
                    highlight={w.highlight}
                  >
                    {w.text}
                  </ScrollWord>
                );
              })}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
            >
              <RollingTextButton
                buttonText="Exhibitor Portal"
                bgColor="var(--color-primary)"
                textColor="var(--color-light)"
                link="#speakers"
                withArrow
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
