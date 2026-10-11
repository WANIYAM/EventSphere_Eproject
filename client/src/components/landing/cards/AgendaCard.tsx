import React from "react";

interface AgendaCardProps {
  time: string;
  image: string;
  introduction: string;
  description: string;
}

export const AgendaCard: React.FC<AgendaCardProps> = ({
  time,
  image,
  introduction,
  description,
}) => {
  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      gap: 20,
      padding: "24px 0",
      borderBottom: "2px solid var(--color-dark)",
      alignItems: "center"
    }}>
      <div style={{ flex: "0 0 180px" }}>
        <span className="style-display" style={{ fontSize: 38 }}>{time}</span>
      </div>
      <div style={{ width: 200, height: 120, border: "2px solid var(--color-dark)", overflow: "hidden", flexShrink: 0 }}>
        <img src={image} alt={introduction} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1, minWidth: 260 }}>
        <h4 className="style-p2" style={{ fontSize: 26, marginBottom: 8 }}>{introduction}</h4>
        <p className="style-p4" style={{ opacity: 0.85 }}>{description}</p>
      </div>
    </div>
  );
};