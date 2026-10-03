import React, { useState } from "react";
import { motion } from "framer-motion";

interface AgendaItem {
  id: string;
  time: string;
  timeBadgeBg: string;
  stageTag: string;
  introduction: string;
  description: string;
  image: string;
  badgeTextColor?: string;
}

const EXPO_SCHEDULE: AgendaItem[] = [
  {
    id: "01",
    time: "09:00 - 10:30",
    timeBadgeBg: "var(--color-primary)",
    badgeTextColor: "#ffffff",
    stageTag: "MAIN AUDITORIUM // OPENING",
    introduction: "Opening Keynote & EventSphere Platform Unveiling",
    description: "Welcome address on modernizing multi-industry trade shows through unified registration and real-time floor plans.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "02",
    time: "11:00 - 13:00",
    timeBadgeBg: "var(--color-purple-mimosa)",
    badgeTextColor: "#ffffff",
    stageTag: "EXHIBIT HALL // BOOTH DEMOS",
    introduction: "Exhibitor Product Showcases & Interactive Floor Walk",
    description: "Commercial exhibitors demonstrate products across reserved booth zones with instant digital lead retrieval.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "03",
    time: "14:30 - 16:30",
    timeBadgeBg: "var(--color-cerulean)",
    badgeTextColor: "#ffffff",
    stageTag: "CONFERENCE ROOM B // WORKSHOP",
    introduction: "Panel: Scalable Architecture for Global Expos",
    description: "Industry veterans and organizers analyze concurrent user throughput, automated reporting, and role-based permissions.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "04",
    time: "18:00 - 21:00",
    timeBadgeBg: "var(--color-kiwi)",
    badgeTextColor: "var(--color-dark)",
    stageTag: "EXECUTIVE LOUNGE // NETWORKING",
    introduction: "B2B Matchmaking Gala & Exhibitor Awards",
    description: "Direct collaboration between registered attendees, exhibitors, and venue organizers over cocktails.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
  },
];

export const AgendaSection: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="agenda"
      style={{
        backgroundColor: "transparent",
        padding: "100px clamp(24px, 4vw, 72px) 140px clamp(24px, 4vw, 72px)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
        width: "100%", // Full width
      }}
    >
      <div style={{ width: "100%" }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}>
          <h2
            className="style-display"
            style={{
              fontSize: "clamp(64px, 9vw, 128px)", // Enlarged Title
              color: "var(--color-dark)",
              lineHeight: 0.9,
              margin: 0,
              letterSpacing: 2,
            }}
          >
            EXPO &#123; SCHEDULE &#125; 2025
          </h2>
        </div>

        {/* Full-Width Interactive Schedule List */}
        <div style={{ display: "flex", flexDirection: "column", borderTop: "3px solid var(--color-dark)", width: "100%" }}>
          {EXPO_SCHEDULE.map((slot) => {
            const isHovered = hoveredId === slot.id;

            return (
              <motion.div
                key={slot.id}
                onMouseEnter={() => setHoveredId(slot.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setHoveredId(isHovered ? null : slot.id)}
                animate={{
                  backgroundColor: isHovered ? "rgba(255, 255, 255, 0.5)" : "transparent",
                  boxShadow: isHovered ? "6px 6px 0px var(--color-dark)" : "0px 0px 0px transparent",
                  y: isHovered ? -4 : 0,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                style={{
                  padding: "clamp(32px, 3.5vw, 44px) clamp(16px, 2.5vw, 36px)", // Larger row padding
                  borderBottom: "3px solid var(--color-dark)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "clamp(24px, 3vw, 48px)",
                  flexWrap: "wrap",
                  position: "relative",
                  borderRadius: 4,
                  width: "100%",
                  boxSizing: "border-box",
                  transition: "background-color 0.2s ease",
                }}
              >
                {/* 1. Enlarged Time Badge Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "0 0 clamp(240px, 22vw, 320px)" }}>
                  <motion.div
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: slot.timeBadgeBg,
                      color: slot.badgeTextColor || "#fff",
                      border: "2.5px solid var(--color-dark)",
                      boxShadow: "3px 3px 0px var(--color-dark)",
                      padding: "8px 22px", // Larger pill padding
                      borderRadius: 6,
                      width: "fit-content",
                    }}
                  >
                    <span className="style-display" style={{ fontSize: "clamp(28px, 2.8vw, 42px)", letterSpacing: 0.5, lineHeight: 1 }}>
                      {slot.time}
                    </span>
                  </motion.div>

                  <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, color: "var(--color-dark)", opacity: 0.8, letterSpacing: 0.5 }}>
                    {slot.stageTag}
                  </span>
                </div>

                {/* 2. Larger Spring-Unfolding Thumbnail (Reveals on Hover) */}
                <motion.div
                  initial={false}
                  animate={{
                    width: isHovered ? 290 : 0, // Enlarged width
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.8,
                    rotate: isHovered ? -2.5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  style={{
                    height: 165, // Enlarged height
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    border: isHovered ? "3px solid var(--color-dark)" : "none",
                    boxShadow: isHovered ? "5px 5px 0px var(--color-dark)" : "none",
                    backgroundColor: "var(--color-dark)",
                  }}
                  className="agenda-hover-image"
                >
                  <div style={{ position: "absolute", top: 8, left: 8, width: 10, height: 10, borderTop: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                  <div style={{ position: "absolute", top: 8, right: 8, width: 10, height: 10, borderTop: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />
                  <div style={{ position: "absolute", bottom: 8, left: 8, width: 10, height: 10, borderBottom: "2.5px solid #fff", borderLeft: "2.5px solid #fff", zIndex: 10 }} />
                  <div style={{ position: "absolute", bottom: 8, right: 8, width: 10, height: 10, borderBottom: "2.5px solid #fff", borderRight: "2.5px solid #fff", zIndex: 10 }} />

                  <img
                    src={slot.image}
                    alt={slot.introduction}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>

                {/* 3. Enlarged Text Details */}
                <motion.div
                  animate={{ x: isHovered ? 12 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <h3
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "clamp(26px, 2.6vw, 38px)", // Enlarged Title
                      fontWeight: 700,
                      color: "var(--color-dark)",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {slot.introduction}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "clamp(16px, 1.3vw, 20px)", // Enlarged Description
                      fontWeight: 500,
                      color: "var(--color-dark)",
                      opacity: 0.85,
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {slot.description}
                  </p>
                </motion.div>

                {/* 4. Enlarged Rotating Arrow Button */}
                <motion.div
                  animate={{
                    rotate: isHovered ? -45 : 0,
                    backgroundColor: isHovered ? "var(--color-dark)" : "transparent",
                    color: isHovered ? "#ffffff" : "var(--color-dark)",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: 56, // Enlarged from 44px
                    height: 56,
                    borderRadius: "50%",
                    border: "2.5px solid var(--color-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .agenda-hover-image {
            width: 100% !important;
            opacity: 1 !important;
            scale: 1 !important;
            rotate: 0deg !important;
            margin-top: 14px;
          }
        }
      `}</style>
    </section>
  );
};