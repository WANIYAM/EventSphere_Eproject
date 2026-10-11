import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface GalleryPhoto {
  w: number;
  h: number;
  year: string;
  badgeBg: string;
  badgeTextColor: string;
  shadowColor: string;
  src: string;
  label: string;
}

const EXPO_GALLERY_ITEMS: GalleryPhoto[] = [
  {
    w: 310,
    h: 360,
    year: "MAIN CONCOURSE",
    badgeBg: "var(--color-primary)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-primary)",
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&auto=format&fit=crop&q=80",
    label: "Main trade show convention hall",
  },
  {
    w: 300,
    h: 240,
    year: "KEYNOTE ARENA",
    badgeBg: "var(--color-selective-yellow)",
    badgeTextColor: "var(--color-dark)",
    shadowColor: "var(--color-selective-yellow)",
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&auto=format&fit=crop&q=80",
    label: "Auditorium keynote stage",
  },
  {
    w: 520,
    h: 340,
    year: "EXHIBIT PAVILION",
    badgeBg: "var(--color-cerulean)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-cerulean)",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    label: "Exhibition booth floor plan",
  },
  {
    w: 105,
    h: 260,
    year: "B2B HUB",
    badgeBg: "var(--color-light)",
    badgeTextColor: "var(--color-dark)",
    shadowColor: "#ffffff",
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=80",
    label: "VIP meeting lounge",
  },
  {
    w: 360,
    h: 360,
    year: "DEMO PODS",
    badgeBg: "var(--color-violet-pink)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-violet-pink)",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700&auto=format&fit=crop&q=80",
    label: "Live product demonstrations",
  },
  {
    w: 300,
    h: 240,
    year: "WORKSHOP LAB",
    badgeBg: "var(--color-purple-mimosa)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-purple-mimosa)",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80",
    label: "Interactive breakout sessions",
  },
  {
    w: 520,
    h: 340,
    year: "GLOBAL GALA",
    badgeBg: "var(--color-kiwi)",
    badgeTextColor: "var(--color-dark)",
    shadowColor: "var(--color-kiwi)",
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    label: "Closing networking event",
  },
  {
    w: 105,
    h: 260,
    year: "STARTUP ZONE",
    badgeBg: "var(--color-primary)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-primary)",
    src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80",
    label: "Innovation showcase stage",
  },
];

export const HorizontalScrollSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(1600);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [bracketHovered, setBracketHovered] = useState(false);

  useEffect(() => {
    const calcScroll = () => {
      if (trackRef.current) {
        const overflow = trackRef.current.scrollWidth - window.innerWidth + 140;
        setMaxScroll(Math.max(0, overflow));
      }
    };
    calcScroll();
    window.addEventListener("resize", calcScroll);
    return () => window.removeEventListener("resize", calcScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.2,
    restDelta: 0.0001,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -maxScroll]);
  const bgTextX = useTransform(smoothProgress, [0, 1], [0, 300]);
  const timelineScale = useTransform(smoothProgress, [0, 1], [0.08, 1]);
  const titleOpacity = useTransform(smoothProgress, [0.85, 0.96], [1, 0]);
  const titleY = useTransform(smoothProgress, [0.85, 0.96], [0, -35]);

  return (
    <section
      id="gallery"
      ref={containerRef}
      style={{
        height: "2900px",
        position: "relative",
        backgroundColor: "#0a090d",
        paddingTop: 0,
        zIndex: 10,
        overflow: "visible",
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
          overflow: "hidden",
          gap: 28,
        }}
      >
        <motion.div
          style={{
            x: bgTextX,
            position: "absolute",
            top: "16%",
            left: "-5vw",
            width: "200vw",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 2,
            userSelect: "none",
          }}
        >
          <span
            className="style-display"
            style={{
              fontSize: "clamp(120px, 18vw, 220px)",
              lineHeight: 0.85,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.06)",
              letterSpacing: 4,
            }}
          >
            EVENTSPHERE EXPO SUITE • FLOOR PLANS & SESSIONS •
          </span>
        </motion.div>

        {/* Horizontal Photos */}
        <motion.div
          ref={trackRef}
          style={{
            x,
            display: "flex",
            alignItems: "flex-end",
            gap: 28,
            paddingLeft: "clamp(32px, 5vw, 72px)",
            paddingRight: "clamp(32px, 5vw, 72px)",
            width: "max-content",
            willChange: "transform",
            position: "relative",
            zIndex: 5,
          }}
        >
          {EXPO_GALLERY_ITEMS.map((item, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                animate={{
                  y: isHovered ? -14 : 0,
                  scale: isHovered ? 1.03 : 1,
                  boxShadow: isHovered
                    ? `8px 8px 0px ${item.shadowColor}`
                    : "4px 4px 0px rgba(0,0,0,0.8)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                style={{
                  width: item.w,
                  height: item.h,
                  border: "2px solid #ffffff",
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: "#131116",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "absolute", top: 6, left: 6, width: 9, height: 9, borderTop: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", top: 6, right: 6, width: 9, height: 9, borderTop: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", bottom: 6, left: 6, width: 9, height: 9, borderBottom: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 9, height: 9, borderBottom: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />

                <motion.div
                  animate={{ y: isHovered ? -2 : 0 }}
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: item.badgeBg,
                    color: item.badgeTextColor,
                    padding: "4px 9px",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.8,
                    border: "1.5px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                    zIndex: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.year}
                </motion.div>

                <motion.img
                  src={item.src}
                  alt={item.label}
                  loading="eager"
                  animate={{ scale: isHovered ? 1.06 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "contrast(1.08) brightness(0.96)",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lower Deck: Timeline & Title */}
        <div
          style={{
            width: "100%",
            maxWidth: 1380,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            boxSizing: "border-box",
            userSelect: "none",
            position: "relative",
            zIndex: 6,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ffffff", opacity: 0.8, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
              <span>FLOOR PLAN A</span>
              <span style={{ color: "var(--color-kiwi)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-kiwi)", display: "inline-block" }} />
                REAL-TIME BOOTH MAP
              </span>
              <span>FLOOR PLAN D</span>
            </div>

            <div style={{ width: "100%", height: 6, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(255,255,255,0.18)" }}>
              <motion.div
                style={{
                  height: "100%",
                  scaleX: timelineScale,
                  transformOrigin: "left center",
                  backgroundColor: "var(--color-primary)",
                  boxShadow: "0 0 10px var(--color-primary)",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, color: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "'Satoshi', sans-serif" }}>
              <span>EXPO LAYOUT // 150,000 SQ FT</span>
              <span>•</span>
              <span>500+ ALLOCATED BOOTHS</span>
            </div>
          </div>

          <motion.div
            style={{
              opacity: titleOpacity,
              y: titleY,
              textAlign: "right",
              cursor: "pointer",
            }}
            onMouseEnter={() => setBracketHovered(true)}
            onMouseLeave={() => setBracketHovered(false)}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4, color: "var(--color-kiwi)", fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700 }}>
              <motion.span animate={{ rotate: [0, 180, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                ★
              </motion.span>
              <span>ANNUAL INDUSTRY EXHIBITION</span>
            </div>

            <h2 className="style-display" style={{ fontSize: "clamp(50px, 6.5vw, 88px)", color: "#ffffff", lineHeight: 0.88, margin: 0 }}>
              EXPO EXCELLENCE
            </h2>
            <h2 className="style-display" style={{ fontSize: "clamp(50px, 6.5vw, 88px)", color: "var(--color-primary)", lineHeight: 0.88, margin: 0 }}>
              <motion.span animate={{ x: bracketHovered ? -10 : 0, color: bracketHovered ? "var(--color-kiwi)" : "#ffffff" }} transition={{ type: "spring", stiffness: 450, damping: 20 }} style={{ display: "inline-block", color: "#ffffff" }}>
                &#123;
              </motion.span>{" "}
              2025{" "}
              <motion.span animate={{ x: bracketHovered ? 10 : 0, color: bracketHovered ? "var(--color-kiwi)" : "#ffffff" }} transition={{ type: "spring", stiffness: 450, damping: 20 }} style={{ display: "inline-block", color: "#ffffff" }}>
                &#125;
              </motion.span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
