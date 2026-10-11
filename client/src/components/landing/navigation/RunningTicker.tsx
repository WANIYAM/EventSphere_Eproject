import React from "react";

export const RunningTicker: React.FC = () => {
  const items = [
    "30+ TALKS",
    "50+ EXHIBITORS",
    "2,500+ ATTENDEES",
    "12 KEYNOTES",
    "48H HACKATHON",
    "KOMCA DPS 1 PENANG",
  ];

  return (
    <div style={{
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: 260,
      maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
      WebkitMaskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
    }}>
      <div className="marquee-track" style={{ animationDuration: "12s" }}>
        {[...items, ...items].map((txt, i) => (
          <span key={i} className="style-p6" style={{ fontSize: 13, marginRight: 16, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span>●</span> {txt}
          </span>
        ))}
      </div>
    </div>
  );
};