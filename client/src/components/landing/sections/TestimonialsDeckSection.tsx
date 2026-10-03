import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
  accentColor: string;
  baseRot: number;
}

const EXPO_TESTIMONIALS: Testimonial[] = [
  {
    id: 0,
    name: "Sarah Mitchell",
    role: "Lead Event Organizer",
    company: "Global TradeSphere Expo",
    quote: "EventSphere eliminated our traditional paperwork bottlenecks. Managing 450+ exhibitor applications and real-time floor plan allocations in one single dashboard saved us hundreds of staff hours.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    accentColor: "var(--color-primary)",
    baseRot: -8,
  },
  {
    id: 1,
    name: "David Kim",
    role: "Exhibitor & Sales Director",
    company: "Apex Industrial Robotics",
    quote: "Selecting and reserving our booth space directly on the interactive floor plan was seamless. The built-in attendee communication channel drove 300+ pre-booked product demos before the show even opened.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    accentColor: "var(--color-selective-yellow)",
    baseRot: -3,
  },
  {
    id: 2,
    name: "Ayesha Rahman",
    role: "Operations VP",
    company: "NexGen Trade Shows",
    quote: "The real-time schedule management is flawless. Last-minute room and speaker changes synchronized within 1 second to all attendee portals and hallway signage with zero confusion.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    accentColor: "var(--color-cerulean)",
    baseRot: 3,
  },
  {
    id: 3,
    name: "James Carter",
    role: "Enterprise Attendee & Buyer",
    company: "Venture Logistics Group",
    quote: "Filtering exhibitors by product keywords and bookmarking keynote sessions on my phone transformed my visit. The floor map routing helped our sourcing team cover the entire 150,000 sq ft venue in 2 days.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    accentColor: "var(--color-kiwi)",
    baseRot: 8,
  },
];

export const TestimonialsDeckSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [pinnedCard, setPinnedCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.25,
  });

  const card3X = useTransform(smoothProgress, [0.25, 0.45], [0, 520]);
  const card3Rot = useTransform(smoothProgress, [0.25, 0.45], [8, 28]);
  const card3Opacity = useTransform(smoothProgress, [0.38, 0.45], [1, 0]);

  const card2X = useTransform(smoothProgress, [0.5, 0.7], [0, -520]);
  const card2Rot = useTransform(smoothProgress, [0.5, 0.7], [3, -28]);
  const card2Opacity = useTransform(smoothProgress, [0.63, 0.7], [1, 0]);

  const card1X = useTransform(smoothProgress, [0.75, 0.92], [0, 520]);
  const card1Rot = useTransform(smoothProgress, [0.75, 0.92], [-3, 26]);
  const card1Opacity = useTransform(smoothProgress, [0.86, 0.92], [1, 0]);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      style={{
        height: "320vh",
        position: "relative",
        backgroundColor: "#0a090d",
        zIndex: 12,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(171, 241, 57, 0.12) 0%, rgba(166, 126, 255, 0.08) 45%, rgba(10, 9, 13, 0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div style={{ textAlign: "center", marginBottom: 28, position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 14px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 30,
              color: "var(--color-kiwi)",
              fontSize: 13,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            <span>★★★★★</span>
            <span style={{ color: "#ffffff", opacity: 0.9 }}>VERIFIED ORGANIZERS & EXHIBITORS</span>
          </div>

          <h2
            className="style-display"
            style={{
              fontSize: "clamp(46px, 7vw, 92px)",
              color: "#ffffff",
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: 2,
            }}
          >
            CLIENT VALIDATION
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 36,
            position: "relative",
            zIndex: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {EXPO_TESTIMONIALS.map((t) => {
            const isSelected = pinnedCard === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setPinnedCard(pinnedCard === t.id ? null : t.id)}
                style={{
                  backgroundColor: isSelected ? t.accentColor : "rgba(35, 30, 37, 0.6)",
                  color: isSelected ? "#000000" : "#ffffff",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                [{t.id + 1}] {t.name.split(" ")[0].toUpperCase()} ({t.role.split(" ")[0]})
              </button>
            );
          })}
        </div>

        <div
          style={{
            position: "relative",
            width: "clamp(320px, 32vw, 440px)",
            height: 420,
            zIndex: 5,
          }}
        >
          {EXPO_TESTIMONIALS.map((t) => {
            const isHovered = hoveredCard === t.id;
            const isPinned = pinnedCard === t.id;

            let peelX: any = 0;
            let peelRot: any = t.baseRot;
            let peelOpacity: any = 1;

            if (t.id === 3) {
              peelX = card3X;
              peelRot = card3Rot;
              peelOpacity = card3Opacity;
            } else if (t.id === 2) {
              peelX = card2X;
              peelRot = card2Rot;
              peelOpacity = card2Opacity;
            } else if (t.id === 1) {
              peelX = card1X;
              peelRot = card1Rot;
              peelOpacity = card1Opacity;
            }

            return (
              <motion.div
                key={t.id}
                onMouseEnter={() => setHoveredCard(t.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setPinnedCard(pinnedCard === t.id ? null : t.id)}
                style={{
                  position: "absolute",
                  inset: 0,
                  x: isHovered || isPinned ? 0 : peelX,
                  rotate: isHovered || isPinned ? 0 : peelRot,
                  opacity: isPinned ? 1 : peelOpacity,
                  zIndex: isPinned ? 50 : isHovered ? 40 : t.id + 1,
                  backgroundColor: "var(--color-light)",
                  border: "3px solid var(--color-dark)",
                  boxShadow: isPinned || isHovered
                    ? `10px 10px 0px ${t.accentColor}`
                    : `5px 5px 0px var(--color-dark)`,
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                  scale: isPinned ? 1.05 : isHovered ? 1.03 : 1,
                  y: isPinned ? -15 : isHovered ? -12 : 0,
                  transition: "scale 0.25s ease, y 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 3, color: "var(--color-primary)", fontSize: 16 }}>
                    {"★".repeat(t.rating)}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: t.accentColor,
                      color: t.accentColor === "var(--color-kiwi)" ? "#000" : "#fff",
                      padding: "2px 8px",
                      borderRadius: 4,
                      border: "1px solid var(--color-dark)",
                    }}
                  >
                    SRS VALIDATED
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "clamp(16px, 1.4vw, 19px)",
                    fontWeight: 600,
                    color: "var(--color-dark)",
                    lineHeight: 1.45,
                    margin: "18px 0",
                    fontStyle: "normal",
                  }}
                >
                  “{t.quote}”
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    borderTop: "2px solid var(--color-dark)",
                    paddingTop: 16,
                  }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--color-dark)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h4
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 17,
                        fontWeight: 800,
                        color: "var(--color-dark)",
                        margin: 0,
                      }}
                    >
                      {t.name}
                    </h4>
                    <p
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 13,
                        color: "#555",
                        margin: "2px 0 0 0",
                        fontWeight: 600,
                      }}
                    >
                      {t.role} • <span style={{ color: "var(--color-dark)" }}>{t.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
