import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const GALLERY_ITEMS = [
  {
    w: 310,
    h: 360,
    year: "EVENT MANAGEMENT",
    badgeBg: "var(--color-primary)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-primary)",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80",
    label: "Event organizers managing an expo",
  },
  {
    w: 300,
    h: 240,
    year: "ATTENDEE REGISTRATION",
    badgeBg: "var(--color-selective-yellow)",
    badgeTextColor: "var(--color-dark)",
    shadowColor: "var(--color-selective-yellow)",
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&auto=format&fit=crop&q=80",
    label: "Attendees at an event",
  },
  {
    w: 520,
    h: 340,
    year: "EXHIBITOR PROFILES",
    badgeBg: "var(--color-cerulean)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-cerulean)",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    label: "Exhibitors presenting products at a trade show",
  },
  {
    w: 105,
    h: 260,
    year: "BOOTH SPACES",
    badgeBg: "var(--color-light)",
    badgeTextColor: "var(--color-dark)",
    shadowColor: "#ffffff",
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=80",
    label: "Expo booth display",
  },
  {
    w: 360,
    h: 360,
    year: "EVENT SCHEDULE",
    badgeBg: "var(--color-violet-pink)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-violet-pink)",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700&auto=format&fit=crop&q=80",
    label: "Event session in progress",
  },
  {
    w: 300,
    h: 240,
    year: "EXPO FLOOR PLAN",
    badgeBg: "var(--color-purple-mimosa)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-purple-mimosa)",
    src: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=700&auto=format&fit=crop&q=80",
    label: "Trade show floor",
  },
  {
    w: 520,
    h: 340,
    year: "EVENT PARTICIPANTS",
    badgeBg: "var(--color-kiwi)",
    badgeTextColor: "var(--color-dark)",
    shadowColor: "var(--color-kiwi)",
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    label: "People attending an expo",
  },
  {
    w: 105,
    h: 260,
    year: "EVENT UPDATES",
    badgeBg: "var(--color-primary)",
    badgeTextColor: "#ffffff",
    shadowColor: "var(--color-primary)",
    src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80",
    label: "Expo presentation",
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
    // Inside HorizontalScrollSection.tsx, replace the <section> style:
      <section
        id="gallery"
        ref={containerRef}
        style={{
          height: "2900px",
          position: "relative",
          backgroundColor: "transparent", // REMOVED HARDCODED BLACK: lets GlobalBackground smoothly dissolve into cream!
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
        {/* Ambient Stage Glow */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: 500,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20, 166, 234, 0.16) 0%, rgba(10, 9, 13, 0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "25%",
            right: "15%",
            width: 550,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 62, 51, 0.14) 0%, rgba(255, 85, 248, 0.08) 50%, rgba(10, 9, 13, 0) 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Hollow Outline Watermark */}
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
            EVENTSPHERE MANAGEMENT - EXPO & TRADE SHOW PLATFORM -
          </span>
        </motion.div>

        {/* Horizontal Photo Reel */}
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
          {GALLERY_ITEMS.map((item, i) => {
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
                <div style={{ position: "absolute", bottom: 6, left: 6, width: 8, height: 8, borderBottom: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 8, height: 8, borderBottom: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />

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
                    filter: "contrast(1.08) brightness(0.98)",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lower Deck: Gallery progress and event management title */}
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
          {/* Timeline Scrubber */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ffffff", opacity: 0.8, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
              <span>EVENT MANAGEMENT</span>
              <span style={{ color: "var(--color-kiwi)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-kiwi)", display: "inline-block" }} />
                EXPO GALLERY
              </span>
              <span>EVENT HIGHLIGHTS</span>
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
              <span>EXPO INFORMATION</span>
              <span>-</span>
              <span>EVENT WORKFLOWS</span>
            </div>
          </div>

          {/* Event management platform title */}
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
              <span>ORGANIZATORS, EXHIBITORS & ATTENDEES</span>
            </div>

            <h2
              className="style-display"
              style={{
                fontSize: "clamp(50px, 6.5vw, 88px)",
                color: "#ffffff",
                lineHeight: 0.88,
                whiteSpace: "nowrap",
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              ONE PLATFORM
            </h2>

            <h2
              className="style-display"
              style={{
                fontSize: "clamp(50px, 6.5vw, 88px)",
                color: "var(--color-primary)",
                lineHeight: 0.88,
                whiteSpace: "nowrap",
                margin: 0,
                letterSpacing: 1.5,
                textShadow: "0 0 25px rgba(255, 62, 51, 0.4)",
              }}
            >
              <motion.span
                animate={{
                  x: bracketHovered ? -10 : 0,
                  color: bracketHovered ? "var(--color-kiwi)" : "#ffffff",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                style={{ display: "inline-block", color: "#ffffff" }}
              >
                &#123;
              </motion.span>{" "}
              EVENTSPHERE{" "}
              <motion.span
                animate={{
                  x: bracketHovered ? 10 : 0,
                  color: bracketHovered ? "var(--color-kiwi)" : "#ffffff",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                style={{ display: "inline-block", color: "#ffffff" }}
              >
                &#125;
              </motion.span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
};