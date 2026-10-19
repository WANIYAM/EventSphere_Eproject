import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const stickerFrameStyle: React.CSSProperties = {
  position: "relative",
  backgroundColor: "#ffffff",
  border: "2.5px solid #000000",
  boxShadow: "4px 4px 0 #000000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontFamily: "'Satoshi', sans-serif",
  fontWeight: 900,
  fontSize: 14,
  letterSpacing: 0.6,
  color: "#000",
  padding: 8,
};

const StickerPulse: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.8, repeat: Infinity }}
    style={{
      position: "absolute", top: -6, right: -6, width: 10, height: 10, borderRadius: "50%",
      background: color, border: "2px solid #000", boxShadow: "0 0 8px " + color,
    }}
  />
);

const LaptopSticker: React.FC = () => (
  <motion.div
    animate={{ rotate: [-3, 3, -3] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    style={{ ...stickerFrameStyle, width: 140, height: 120 }}
  >
    <StickerPulse color="#abf139" />
    <div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>★ LIVE ★</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1 }}>EXPO LIVE</div>
      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>20.04.26 / 09:00</div>
    </div>
  </motion.div>
);

const WaveSticker: React.FC = () => (
  <motion.div
    animate={{ rotate: [4, -4, 4] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    style={{ ...stickerFrameStyle, width: 130, height: 130 }}
  >
    <StickerPulse color="#feb804" />
    <div style={{ lineHeight: 1.15 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>SMART</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>SIGNAGE</div>
      <div style={{ width: 40, height: 3, background: "#000", margin: "4px auto" }} />
      <div style={{ fontSize: 9 }}>EXPO NETWORK</div>
    </div>
  </motion.div>
);

const EpycSticker: React.FC = () => (
  <motion.div
    animate={{ rotate: [-2, 2, -2] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    style={{ ...stickerFrameStyle, width: 135, height: 120 }}
  >
    <StickerPulse color="#ff55f8" />
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 1 }}>EPYC</div>
      <div style={{ fontSize: 10, marginTop: 2 }}>CLOUD INFRA</div>
      <div style={{ fontSize: 9, opacity: 0.7, marginTop: 4 }}>99.99% UPTIME</div>
    </div>
  </motion.div>
);

const CoolBeanSticker: React.FC = () => (
  <motion.div
    animate={{ rotate: [3, -3, 3] }}
    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
    style={{ ...stickerFrameStyle, width: 135, height: 135 }}
  >
    <StickerPulse color="#14a6ea" />
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>IOT</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>SENSORS</div>
      <div style={{ fontSize: 9, marginTop: 4 }}>REAL-TIME</div>
    </div>
  </motion.div>
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
          <div style={{ marginBottom: 32, position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "3px 12px", background: "#000", color: "#fff", fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 1, transform: "rotate(-1.2deg)" }}>
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 6, height: 6, background: "#abf139", borderRadius: "50%" }} />
              PARTNER NETWORK / 2026
            </div>
            <h2 className="style-display" style={{ fontSize: "clamp(52px, 7.5vw, 100px)", color: "var(--color-dark)", lineHeight: 0.9, letterSpacing: 2, margin: 0 }}>
              OUR &#123; PARTNERS &#125;
            </h2>
            <h2 className="style-display" style={{ fontSize: "clamp(52px, 7.5vw, 100px)", color: "var(--color-dark)", lineHeight: 0.9, letterSpacing: 2, margin: 0 }}>
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
                    <span>Scroll</span>
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
                    <span>Scroll</span>
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
                    <span>Scroll</span>
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
                    <span>Scroll</span>
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
