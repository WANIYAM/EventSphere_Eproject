import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface AgendaItem {
  id: string;
  time: string;
  stageTag: string;
  introduction: string;
  description: string;
  image: string;
  bg: string;
  rotate: number;
  offsetX: number;
  topOffset: number;
  gridType: "squares" | "dots";
}

const DEFAULT_SCHEDULE: AgendaItem[] = [
  {
    id: "01",
    time: "09:00 - 10:30",
    stageTag: "MAIN HALL // EVENT INFORMATION",
    introduction: "Expo Welcome and Event Information",
    description: "Find event details, registration information, and guidance for exhibitors and attendees.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
    bg: "rgb(255, 85, 248)", // Violet Pink (Card 1)
    rotate: -2.0,
    offsetX: -10,
    topOffset: 120,
    gridType: "squares",
  },
  {
    id: "02",
    time: "11:00 - 13:00",
    stageTag: "EXHIBIT HALL // EXHIBITOR SHOWCASE",
    introduction: "Exhibitor Profiles and Booth Spaces",
    description: "Browse exhibitor profiles, products and services, and booth locations on the event floor plan.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
    bg: "rgb(254, 184, 4)", // Selective Yellow (Card 2)
    rotate: 1.8,
    offsetX: 12,
    topOffset: 160,
    gridType: "dots",
  },
  {
    id: "03",
    time: "14:30 - 16:30",
    stageTag: "EVENT LOCATION // WORKSHOP",
    introduction: "Planning Sessions and Workshops",
    description: "Review session topics, speakers, time slots, and locations in the event schedule.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
    bg: "rgb(255, 164, 144)", // Terracotta (Card 3)
    rotate: -1.6,
    offsetX: -8,
    topOffset: 200,
    gridType: "dots",
  },
  {
    id: "04",
    time: "18:00 - 21:00",
    stageTag: "EXPO FLOOR // ATTENDEE GUIDE",
    introduction: "Plan an Expo Visit",
    description: "Register for events and sessions, bookmark sessions of interest, and check event updates.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    bg: "rgb(171, 241, 57)", // Kiwi Green (Card 4)
    rotate: 2.2,
    offsetX: 10,
    topOffset: 240,
    gridType: "squares",
  },
];

const CARD_STYLES = [
  { bg: "rgb(255, 85, 248)", rotate: -2.0, offsetX: -10, topOffset: 120, gridType: "squares" as const },
  { bg: "rgb(254, 184, 4)", rotate: 1.8, offsetX: 12, topOffset: 160, gridType: "dots" as const },
  { bg: "rgb(255, 164, 144)", rotate: -1.6, offsetX: -8, topOffset: 200, gridType: "dots" as const },
  { bg: "rgb(171, 241, 57)", rotate: 2.2, offsetX: 10, topOffset: 240, gridType: "squares" as const },
];

export const AgendaSection: React.FC<{ sessions?: any[] }> = ({ sessions = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track exact scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.15,
  });

  // Synchronized color stops mapped directly to each card's stacking arrival window
  const backgroundColor = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.22, 0.42, 0.48, 0.68, 0.74, 0.95],
    [
      "rgb(255, 85, 248)",  // Card 1 Pink
      "rgb(255, 85, 248)",  // Hold Pink
      "rgb(254, 184, 4)",   // Card 2 Yellow locks in
      "rgb(254, 184, 4)",   // Hold Yellow
      "rgb(255, 164, 144)", // Card 3 Terracotta locks in
      "rgb(255, 164, 144)", // Hold Terracotta
      "rgb(171, 241, 57)",  // Card 4 Kiwi locks in
      "rgb(171, 241, 57)",  // Hold Kiwi
    ]
  );

  const displaySlots: AgendaItem[] =
    sessions && sessions.length > 0
      ? sessions.map((s, idx) => {
          const styleCfg = CARD_STYLES[idx % CARD_STYLES.length];
          const startStr = s.startTime
            ? new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "09:00";
          const endStr = s.endTime
            ? new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "10:30";

          return {
            id: s._id || String(idx),
            time: `${startStr} - ${endStr}`,
            stageTag: s.location ? `${s.location.toUpperCase()} // ${s.topic?.toUpperCase() || "SESSION"}` : "MAIN STAGE // SESSION",
            introduction: s.title,
            description: s.speaker ? `Speaker: ${s.speaker} · ${s.topic || "Session"}` : (s.topic || "Event session"),
            image: DEFAULT_SCHEDULE[idx % DEFAULT_SCHEDULE.length].image,
            ...styleCfg,
          };
        })
      : DEFAULT_SCHEDULE;

  const scrollToNextCard = (index: number) => {
    if (index < displaySlots.length - 1) {
      cardRefs.current[index + 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      const nextSection = document.getElementById("floorplan");
      if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.section
      ref={containerRef}
      style={{
        backgroundColor, // Perfectly synced color morph
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
        minHeight: "320vh",
        padding: "100px clamp(20px, 4vw, 56px)",
      }}
    >
      <div
        id="agenda"
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              padding: "4px 12px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            [ EVENT PROGRAM // SCHEDULE ]
          </div>
          <h2
            className="style-display"
            style={{
              fontSize: "clamp(56px, 8.5vw, 114px)",
              color: "var(--color-dark, #231e25)",
              lineHeight: 0.9,
              letterSpacing: 2,
              margin: 0,
            }}
          >
            EXPO &#123; SCHEDULE &#125;
          </h2>
          <h2
            className="style-display"
            style={{
              fontSize: "clamp(56px, 8.5vw, 114px)",
              color: "var(--color-dark, #231e25)",
              lineHeight: 0.9,
              letterSpacing: 2,
              margin: 0,
            }}
          >
            EVENT SCHEDULE
          </h2>
        </div>

        {/* STICKY STACKING WRAPPER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(340px, 48vh, 480px)", position: "relative" }}>
          {displaySlots.map((slot, idx) => (
            <motion.div
              key={slot.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                position: "sticky",
                top: slot.topOffset,
                rotate: slot.rotate,
                x: slot.offsetX,
                backgroundColor: slot.bg,
                border: "2.5px solid #000000",
                boxShadow: "7px 7px 0px #000000",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                overflow: "visible",
                minHeight: 300,
                maxWidth: 1120,
                width: "100%",
                margin: "0 auto",
                zIndex: idx + 1,
                boxSizing: "border-box",
              }}
            >
              {/* LEFT CONTENT AREA */}
              <div
                style={{
                  flex: "1 1 540px",
                  padding: "36px clamp(24px, 4vw, 44px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span
                      style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        padding: "6px 14px",
                        borderRadius: 4,
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        letterSpacing: 1,
                        lineHeight: 1,
                      }}
                    >
                      {slot.time}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 12,
                        fontWeight: 800,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        color: "#000000",
                        padding: "4px 10px",
                        borderRadius: 20,
                        border: "1.5px solid #000000",
                        letterSpacing: 0.5,
                      }}
                    >
                      {slot.stageTag}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "clamp(20px, 2.3vw, 30px)",
                      fontWeight: 800,
                      color: "#000000",
                      lineHeight: 1.25,
                      margin: 0,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {slot.introduction}
                  </h3>

                  <p
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "clamp(15px, 1.4vw, 17px)",
                      fontWeight: 500,
                      color: "#000000",
                      lineHeight: 1.45,
                      margin: 0,
                      maxWidth: 660,
                      opacity: 0.9,
                    }}
                  >
                    {slot.description}
                  </p>
                </div>

                <div>
                  <motion.button
                    onClick={() => scrollToNextCard(idx)}
                    whileHover={{ scale: 1.06, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      border: "2px solid #000000",
                      boxShadow: "3px 3px 0px #000000",
                      padding: "8px 24px",
                      borderRadius: 40,
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>Next session</span>
                  </motion.button>
                </div>
              </div>

              {/* RIGHT GRAPHIC PANEL */}
              <div
                style={{
                  width: "clamp(180px, 25vw, 240px)",
                  borderLeft: "2.5px solid #000000",
                  backgroundColor: slot.bg,
                  backgroundImage:
                    slot.gridType === "squares"
                      ? "linear-gradient(rgba(0,0,0,0.12) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,0,0,0.12) 1.5px, transparent 1.5px)"
                      : "radial-gradient(#000000 1.3px, transparent 1.3px)",
                  backgroundSize: slot.gridType === "squares" ? "20px 20px" : "14px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  padding: 18,
                  flexShrink: 0,
                }}
                className="agenda-right-graphic"
              >
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    border: "2px solid #000000",
                    boxShadow: "4px 4px 0px #000000",
                    backgroundColor: "#000000",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", top: 6, left: 6, width: 8, height: 8, borderTop: "2px solid #fff", borderLeft: "2px solid #fff", zIndex: 10 }} />
                  <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderTop: "2px solid #fff", borderRight: "2px solid #fff", zIndex: 10 }} />
                  <div style={{ position: "absolute", bottom: 6, left: 6, width: 8, height: 8, borderBottom: "2px solid #fff", borderLeft: "2px solid #fff", zIndex: 10 }} />
                  <div style={{ position: "absolute", bottom: 6, right: 6, width: 8, height: 8, borderBottom: "2px solid #fff", borderRight: "2px solid #fff", zIndex: 10 }} />

                  <img
                    src={slot.image}
                    alt={slot.introduction}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};