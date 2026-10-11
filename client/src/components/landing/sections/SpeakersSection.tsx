import React, { useState } from "react";
import { motion } from "framer-motion";

interface SpeakerItem {
  id: string;
  tag: string;
  name: string;
  bio: string;
  cardBg: string;
  handleColor: string;
  image: string;
  contourPath: string;
}

const EXPO_SPEAKERS: SpeakerItem[][] = [
  // COLUMN 1
  [
    {
      id: "sofia",
      tag: "Lead Organizer",
      name: "Sofia Rahman",
      bio: "Spearheading multi-industry trade shows at EventSphere Management, Sofia orchestrates floor plan allocation, VIP protocols, and seamless organizer workflows.",
      cardBg: "rgb(255, 62, 51)",
      handleColor: "#ffffff",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      contourPath: "M 130 55 L 180 50 L 210 75 L 225 110 L 215 155 L 245 190 L 235 240 L 270 270 L 260 380 L 70 380 L 60 270 L 95 240 L 85 190 L 115 155 L 105 110 L 120 75 Z",
    },
    {
      id: "zara",
      tag: "Exhibitor Relations",
      name: "Zara Hossain",
      bio: "Managing over 500+ commercial exhibitors, Zara coordinates customized booth space reservations, corporate inquiries, and inter-exhibitor networking portals.",
      cardBg: "rgb(255, 85, 248)",
      handleColor: "rgb(171, 241, 57)",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      contourPath: "M 135 60 L 195 55 L 230 90 L 225 130 L 285 170 L 270 230 L 260 270 L 275 380 L 55 380 L 70 270 L 60 230 L 45 170 L 105 130 L 100 90 Z",
    },
  ],

  // COLUMN 2 (Center - Elevated)
  [
    {
      id: "arian",
      tag: "Experience Director",
      name: "Arian Malik",
      bio: "A pioneer in trade show transformation, Arian oversees attendee journey mapping, personalized schedule notifications, and automated seminar registrations.",
      cardBg: "rgb(255, 164, 144)",
      handleColor: "var(--color-purple-mimosa)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      contourPath: "M 155 35 L 205 50 L 225 90 L 215 135 L 275 165 L 265 220 L 285 270 L 270 380 L 60 380 L 45 270 L 65 220 L 55 165 L 115 135 L 105 90 L 125 50 Z",
    },
    {
      id: "ethan",
      tag: "Platform Architect",
      name: "Ethan Karim",
      bio: "Ethan architects the EventSphere portal, delivering high-throughput real-time schedule synchronization, floor plan GIS mapping, and GDPR-compliant identity auth.",
      cardBg: "rgb(166, 126, 255)",
      handleColor: "rgb(166, 126, 255)",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
      contourPath: "M 140 45 L 190 40 L 215 80 L 210 120 L 265 140 L 275 190 L 285 250 L 270 380 L 60 380 L 45 250 L 55 190 L 65 140 L 120 120 L 115 80 Z",
    },
  ],

  // COLUMN 3
  [
    {
      id: "noah",
      tag: "Booth Strategist",
      name: "Noah Islam",
      bio: "Consulting top enterprise brands on spatial floor optimization, Noah implements high-conversion booth layouts, QR lead retrieval, and real-time footfall monitoring.",
      cardBg: "rgb(171, 241, 57)",
      handleColor: "rgb(255, 62, 51)",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      contourPath: "M 160 60 L 210 70 L 220 120 L 275 160 L 290 220 L 255 260 L 265 380 L 65 380 L 75 260 L 40 220 L 55 160 L 110 120 L 120 70 Z",
    },
    {
      id: "rayan",
      tag: "Analytics Lead",
      name: "Rayan Haque",
      bio: "Rayan transforms raw event data into executive intelligence—delivering live reporting on session popularity, attendee dwell times, and exhibitor ROI metrics.",
      cardBg: "rgb(255, 248, 235)",
      handleColor: "rgb(20, 166, 234)",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
      contourPath: "M 145 50 L 195 45 L 220 85 L 210 125 L 265 155 L 280 210 L 265 260 L 275 380 L 55 380 L 65 260 L 50 210 L 65 155 L 120 125 L 110 85 Z",
    },
  ],
];

const SpeakerCard: React.FC<{ speaker: SpeakerItem; index: number }> = ({ speaker, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 140, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 20,
        mass: 0.8,
        delay: index * 0.12,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        y: isHovered ? -12 : 0,
        boxShadow: isHovered
          ? "8px 8px 0px var(--color-dark)"
          : "4px 4px 0px var(--color-dark)",
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        width: "100%",
        border: "2.5px solid var(--color-dark)",
        backgroundColor: speaker.cardBg,
      }}
    >
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
          delay: index * 0.12 + 0.2,
        }}
        animate={{
          y: isHovered ? -4 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        style={{
          position: "absolute",
          top: -16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          backgroundColor: "var(--color-dark)",
          color: "var(--color-light)",
          border: "2px solid var(--color-dark)",
          padding: "6px 20px",
          borderRadius: 4,
          boxShadow: "2px 2px 0px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {speaker.tag}
        </span>
      </motion.div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 380,
          overflow: "visible",
        }}
      >
        {[
          { top: -7, left: -7 },
          { top: -7, right: -7 },
          { bottom: -7, left: -7 },
          { bottom: -7, right: -7 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 18,
              delay: index * 0.12 + 0.25 + i * 0.04,
            }}
            animate={{
              scale: isHovered ? 1.45 : 1,
              rotate: isHovered ? 45 : 0,
            }}
            style={{
              position: "absolute",
              ...pos,
              width: 12,
              height: 12,
              backgroundColor: speaker.handleColor,
              border: "2px solid var(--color-dark)",
              zIndex: 20,
            }}
          />
        ))}

        <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <motion.svg
            viewBox="0 0 330 380"
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 2,
            }}
            animate={{
              x: isHovered ? 8 : 0,
              y: isHovered ? -8 : 0,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            <path
              d={speaker.contourPath}
              fill="none"
              stroke="var(--color-dark)"
              strokeWidth="4"
              strokeLinejoin="miter"
              strokeMiterlimit="4"
            />
          </motion.svg>

          <motion.img
            src={speaker.image}
            alt={speaker.name}
            animate={{
              scale: isHovered ? 1.04 : 1,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              position: "relative",
              zIndex: 3,
              width: "82%",
              height: "94%",
              objectFit: "cover",
              objectPosition: "top",
              filter: "contrast(1.05)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: isHovered ? "#ffffff" : "var(--color-light)",
          borderTop: "2.5px solid var(--color-dark)",
          padding: "18px 20px",
          minHeight: 110,
          display: "flex",
          alignItems: "center",
          transition: "background-color 0.2s ease",
        }}
      >
        <p
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 16,
            fontWeight: 500,
            color: "var(--color-dark)",
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {speaker.bio}
        </p>
      </div>
    </motion.div>
  );
};

export const SpeakersSection: React.FC = () => {
  return (
    <section
      id="speakers"
      style={{
        backgroundColor: "transparent",
        padding: "80px clamp(20px, 4vw, 56px) 140px clamp(20px, 4vw, 56px)",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 40 }}
        >
          <h2
            className="style-display"
            style={{
              fontSize: "clamp(54px, 8vw, 110px)",
              color: "var(--color-dark)",
              lineHeight: 0.9,
              letterSpacing: 1.5,
              margin: 0,
            }}
          >
            OUR 2025
          </h2>
          <h2
            className="style-display"
            style={{
              fontSize: "clamp(54px, 8vw, 110px)",
              color: "var(--color-dark)",
              lineHeight: 0.9,
              letterSpacing: 1.5,
              margin: 0,
            }}
          >
            &#123; LEADERSHIP &#125; LINEUP
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(24px, 3vw, 40px)",
            alignItems: "start",
          }}
        >
          {EXPO_SPEAKERS.map((col, colIdx) => (
            <div
              key={colIdx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(48px, 6vw, 70px)",
                paddingTop: colIdx === 1 ? 0 : 80,
              }}
            >
              {col.map((speaker, sIdx) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  index={colIdx + sIdx * 3}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
