import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const LaptopSticker: React.FC = () => (
  <div style={{ position: "relative", width: 140, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="135" height="115" viewBox="0 0 140 120" fill="none">
      <rect x="22" y="12" width="96" height="68" rx="6" fill="#a67eff" stroke="#000000" strokeWidth="2.5" />
      <rect x="28" y="18" width="84" height="56" rx="3" fill="#ff3e33" />
      <text x="70" y="46" textAnchor="middle" fill="#ffffff" fontFamily="'Brush Script MT', cursive, sans-serif" fontSize="22" fontStyle="italic" fontWeight="bold">
        Expo
      </text>
      <text x="70" y="66" textAnchor="middle" fill="#ffffff" fontFamily="'Brush Script MT', cursive, sans-serif" fontSize="22" fontStyle="italic" fontWeight="bold">
        Live!
      </text>
      <path d="M 6 86 L 22 80 L 118 80 L 134 86 L 130 94 L 10 94 Z" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
      <rect x="58" y="84" width="24" height="8" rx="1" fill="#a67eff" stroke="#000000" strokeWidth="1" />
    </svg>
  </div>
);

const WaveSticker: React.FC = () => (
  <div style={{ position: "relative", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="130" height="130" viewBox="0 0 140 140" fill="none">
      <circle cx="70" cy="70" r="62" fill="#ffffff" stroke="#000000" strokeWidth="3" />
      <circle cx="70" cy="68" r="32" fill="#ffa490" />
      <circle cx="70" cy="54" r="16" fill="#feb804" stroke="#000000" strokeWidth="2" />
      <path d="M 40 76 Q 55 64 70 76 T 100 76" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 40 84 Q 55 72 70 84 T 100 84" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path id="waveTextPath" d="M 22 70 A 48 48 0 0 1 118 70" fill="none" />
      <text fontSize="12" fontWeight="800" fontFamily="'Satoshi', sans-serif" letterSpacing="2" fill="#000000">
        <textPath href="#waveTextPath" startOffset="50%" textAnchor="middle">
          SMART SIGNAGE
        </textPath>
      </text>
      <text x="70" y="120" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="'Satoshi', sans-serif" letterSpacing="1.5" fill="#000000">
        EXPO NETWORK
      </text>
    </svg>
  </div>
);

const EpycSticker: React.FC = () => (
  <div style={{ position: "relative", width: 135, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="135" height="120" viewBox="0 0 140 120" fill="none">
      <path d="M 15 110 L 15 65 A 55 55 0 0 1 125 65 L 125 110 Z" fill="#ffffff" stroke="#000000" strokeWidth="3" />
      <path d="M 25 65 A 45 45 0 0 1 115 65" stroke="#feb804" strokeWidth="8" fill="none" />
      <path d="M 33 65 A 37 37 0 0 1 107 65" stroke="#ff55f8" strokeWidth="8" fill="none" />
      <path d="M 41 65 A 29 29 0 0 1 99 65" stroke="#a67eff" strokeWidth="8" fill="none" />
      <path d="M 49 65 A 21 21 0 0 1 91 65" stroke="#14a6ea" strokeWidth="8" fill="none" />
      <text x="70" y="86" textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="'Satoshi', sans-serif" letterSpacing="0.8" fill="#000000">
        CLOUD INFRA
      </text>
      <text x="70" y="102" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="'Satoshi', sans-serif" letterSpacing="0.5" fill="#000000">
        Epyc Cloud
      </text>
    </svg>
  </div>
);

const CoolBeanSticker: React.FC = () => (
  <div style={{ position: "relative", width: 135, height: 135, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="135" height="135" viewBox="0 0 140 140" fill="none">
      <path d="M 20 130 L 20 60 A 50 50 0 0 1 120 60 L 120 130 Z" fill="#ffffff" stroke="#000000" strokeWidth="3" />
      <path id="beanTextPath" d="M 28 60 A 42 42 0 0 1 112 60" fill="none" />
      <text fontSize="11" fontWeight="900" fontFamily="'Satoshi', sans-serif" letterSpacing="2" fill="#ff3e33">
        <textPath href="#beanTextPath" startOffset="50%" textAnchor="middle">
          SMART IOT
        </textPath>
      </text>
      <ellipse cx="70" cy="85" rx="26" ry="34" fill="#feb804" stroke="#000000" strokeWidth="2.5" />
      <rect x="52" y="70" width="16" height="12" rx="2" fill="#000000" />
      <rect x="72" y="70" width="16" height="12" rx="2" fill="#000000" />
      <line x1="68" y1="74" x2="72" y2="74" stroke="#000000" strokeWidth="2" />
      <path d="M 60 92 Q 70 100 80 92" stroke="#000000" strokeWidth="2.5" fill="none" />
      <path d="M 40 92 L 48 84 L 46 72 L 52 74 L 54 86" stroke="#000000" strokeWidth="2" fill="#feb804" />
    </svg>
  </div>
);

export const StackingSponsorsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.25,
  });

  const card1Y = useTransform(smoothProgress, [0.18, 0.38], [0, -700]);
  const card1X = useTransform(smoothProgress, [0.18, 0.38], [-10, -90]);
  const card1Rotate = useTransform(smoothProgress, [0.18, 0.38], [-2.2, -16]);
  const card1Opacity = useTransform(smoothProgress, [0.28, 0.38], [1, 0]);

  const card2Y = useTransform(smoothProgress, [0.44, 0.64], [8, -700]);
  const card2X = useTransform(smoothProgress, [0.44, 0.64], [12, 90]);
  const card2Rotate = useTransform(smoothProgress, [0.44, 0.64], [2.2, 16]);
  const card2Opacity = useTransform(smoothProgress, [0.54, 0.64], [1, 0]);

  const card3Y = useTransform(smoothProgress, [0.70, 0.90], [16, -700]);
  const card3X = useTransform(smoothProgress, [0.70, 0.90], [-8, -90]);
  const card3Rotate = useTransform(smoothProgress, [0.70, 0.90], [-1.8, -16]);
  const card3Opacity = useTransform(smoothProgress, [0.80, 0.90], [1, 0]);

  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.22, 0.38, 0.48, 0.64, 0.74, 0.90],
    [
      "rgb(255, 85, 248)",
      "rgb(255, 85, 248)",
      "rgb(254, 184, 4)",
      "rgb(254, 184, 4)",
      "rgb(255, 164, 144)",
      "rgb(255, 164, 144)",
      "rgb(171, 241, 57)",
    ]
  );

  const scrollNextStep = (step: number) => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight;
    const targetScroll = top + (height * (step / 4));
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <motion.section
      id="sponsors"
      ref={containerRef}
      style={{
        backgroundColor,
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
        height: "360vh",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 clamp(20px, 4vw, 56px)",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1120, width: "100%", margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <h2
              className="style-display"
              style={{
                fontSize: "clamp(52px, 7.5vw, 100px)",
                color: "var(--color-dark)",
                lineHeight: 0.9,
                letterSpacing: 2,
                margin: 0,
              }}
            >
              OUR &#123; PARTNERS &#125;
            </h2>
            <h2
              className="style-display"
              style={{
                fontSize: "clamp(52px, 7.5vw, 100px)",
                color: "var(--color-dark)",
                lineHeight: 0.9,
                letterSpacing: 2,
                margin: 0,
              }}
            >
              POWER THE EXPO
            </h2>
          </div>

          <div style={{ position: "relative", width: "100%", height: 320 }}>
            {/* CARD 4 */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                y: 24,
                x: 10,
                rotate: 2.4,
                zIndex: 1,
                backgroundColor: "rgb(171, 241, 57)",
                border: "2.5px solid #000000",
                boxShadow: "7px 7px 0px #000000",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                overflow: "hidden",
                minHeight: 300,
              }}
            >
              <div style={{ flex: "1 1 540px", padding: "36px clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <span style={{ fontFamily: "'Brush Script MT', 'Satoshi', cursive, sans-serif", fontSize: 32, fontWeight: 900, color: "#000000" }}>
                    SpeckLes
                  </span>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(19px, 2.2vw, 26px)", fontWeight: 500, color: "#000000", lineHeight: 1.35, margin: 0, maxWidth: 660 }}>
                    Our exhibitors captured 300% more verified leads using EventSphere's integrated booth contact exchange and live analytics.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const next = document.getElementById("testimonials");
                      if (next) next.scrollIntoView({ behavior: "smooth" });
                    }}
                    style={{ backgroundColor: "#ffffff", color: "#000000", border: "2px solid #000000", boxShadow: "3px 3px 0px #000000", padding: "8px 24px", borderRadius: 40, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <span>Scroll</span><span style={{ fontSize: 16 }}>↓</span>
                  </button>
                </div>
              </div>
              <div style={{ width: "clamp(180px, 24vw, 240px)", borderLeft: "2.5px solid #000000", backgroundColor: "rgb(171, 241, 57)", backgroundImage: "radial-gradient(#000000 1.3px, transparent 1.3px)", backgroundSize: "14px 14px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 18, flexShrink: 0 }}>
                <CoolBeanSticker />
              </div>
            </motion.div>

            {/* CARD 3 */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                y: card3Y,
                x: card3X,
                rotate: card3Rotate,
                opacity: card3Opacity,
                zIndex: 2,
                backgroundColor: "rgb(255, 164, 144)",
                border: "2.5px solid #000000",
                boxShadow: "7px 7px 0px #000000",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                overflow: "hidden",
                minHeight: 300,
              }}
            >
              <div style={{ flex: "1 1 540px", padding: "36px clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 38, letterSpacing: 1, color: "#000000" }}>EPYC</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#000000" }}>®</span>
                  </div>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(19px, 2.2vw, 26px)", fontWeight: 500, color: "#000000", lineHeight: 1.35, margin: 0, maxWidth: 660 }}>
                    Supported 2,500+ concurrent user check-ins with 99.9% uptime. The benchmark for enterprise expo infrastructure.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => scrollNextStep(3)}
                    style={{ backgroundColor: "#ffffff", color: "#000000", border: "2px solid #000000", boxShadow: "3px 3px 0px #000000", padding: "8px 24px", borderRadius: 40, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <span>Scroll</span><span style={{ fontSize: 16 }}>↓</span>
                  </button>
                </div>
              </div>
              <div style={{ width: "clamp(180px, 24vw, 240px)", borderLeft: "2.5px solid #000000", backgroundColor: "rgb(255, 164, 144)", backgroundImage: "radial-gradient(#000000 1.3px, transparent 1.3px)", backgroundSize: "14px 14px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 18, flexShrink: 0 }}>
                <EpycSticker />
              </div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                y: card2Y,
                x: card2X,
                rotate: card2Rotate,
                opacity: card2Opacity,
                zIndex: 3,
                backgroundColor: "rgb(254, 184, 4)",
                border: "2.5px solid #000000",
                boxShadow: "7px 7px 0px #000000",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                overflow: "hidden",
                minHeight: 300,
              }}
            >
              <div style={{ flex: "1 1 540px", padding: "36px clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <svg width="28" height="12" viewBox="0 0 32 14" fill="none">
                      <path d="M 2 8 Q 8 2 14 8 T 26 8" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M 2 12 Q 8 6 14 12 T 26 12" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </svg>
                    <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 900, letterSpacing: 1.5, color: "#000000" }}>
                      SMART SIGNAGE
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(19px, 2.2vw, 26px)", fontWeight: 500, color: "#000000", lineHeight: 1.35, margin: 0, maxWidth: 660 }}>
                    Real-time schedule synchronization ensured our interactive signage updated within 1 second across every convention hall hallway!
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => scrollNextStep(2)}
                    style={{ backgroundColor: "#ffffff", color: "#000000", border: "2px solid #000000", boxShadow: "3px 3px 0px #000000", padding: "8px 24px", borderRadius: 40, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <span>Scroll</span><span style={{ fontSize: 16 }}>↓</span>
                  </button>
                </div>
              </div>
              <div style={{ width: "clamp(180px, 24vw, 240px)", borderLeft: "2.5px solid #000000", backgroundColor: "rgb(254, 184, 4)", backgroundImage: "radial-gradient(#000000 1.3px, transparent 1.3px)", backgroundSize: "14px 14px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 18, flexShrink: 0 }}>
                <WaveSticker />
              </div>
            </motion.div>

            {/* CARD 1 */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                y: card1Y,
                x: card1X,
                rotate: card1Rotate,
                opacity: card1Opacity,
                zIndex: 4,
                backgroundColor: "rgb(255, 85, 248)",
                border: "2.5px solid #000000",
                boxShadow: "7px 7px 0px #000000",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                overflow: "hidden",
                minHeight: 300,
              }}
            >
              <div style={{ flex: "1 1 540px", padding: "36px clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.88 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 1, color: "#000000" }}>EXPO</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 1, color: "#000000" }}>DISPLAYS</span>
                  </div>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(19px, 2.2vw, 26px)", fontWeight: 500, color: "#000000", lineHeight: 1.35, margin: 0, maxWidth: 660 }}>
                    EventSphere revolutionized our booth allocations. We managed over 400 exhibitor requests in 48 hours with zero double-bookings!
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => scrollNextStep(1)}
                    style={{ backgroundColor: "#ffffff", color: "#000000", border: "2px solid #000000", boxShadow: "3px 3px 0px #000000", padding: "8px 24px", borderRadius: 40, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <span>Scroll</span><span style={{ fontSize: 16 }}>↓</span>
                  </button>
                </div>
              </div>
              <div style={{ width: "clamp(180px, 24vw, 240px)", borderLeft: "2.5px solid #000000", backgroundColor: "rgb(255, 85, 248)", backgroundImage: "linear-gradient(rgba(0,0,0,0.12) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,0,0,0.12) 1.5px, transparent 1.5px)", backgroundSize: "20px 20px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 18, flexShrink: 0 }}>
                <LaptopSticker />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
