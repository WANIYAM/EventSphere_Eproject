import React from "react";
import { motion } from "framer-motion";

interface StatsProps {
  stats: {
    totalExpos: number;
    totalExhibitors: number;
    totalSessions: number;
    totalAttendees: number;
    occupancyRate: number;
  };
}

export const StatsStrip: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    { label: "ACTIVE EXPOS", value: `${stats.totalExpos || 1}`, bg: "var(--color-primary)", text: "#fff" },
    { label: "APPROVED EXHIBITORS", value: `${stats.totalExhibitors || 4}`, bg: "var(--color-selective-yellow)", text: "#000" },
    { label: "SCHEDULED SESSIONS", value: `${stats.totalSessions || 4}`, bg: "var(--color-kiwi)", text: "#000" },
    { label: "REGISTERED ATTENDEES", value: `${stats.totalAttendees ? stats.totalAttendees + "K+" : "2.5K+"}`, bg: "var(--color-purple-mimosa)", text: "#fff" },
    { label: "FLOOR OCCUPANCY", value: `${stats.occupancyRate || 85}%`, bg: "var(--color-cerulean)", text: "#fff" },
  ];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--color-dark)",
        borderTop: "3px solid var(--color-dark)",
        borderBottom: "3px solid var(--color-dark)",
        padding: "20px clamp(16px, 3vw, 40px)",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {statItems.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: item.bg,
              color: item.text,
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              padding: "16px 20px",
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 0.9 }}>
              {item.value}
            </span>
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 1, marginTop: 4 }}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};