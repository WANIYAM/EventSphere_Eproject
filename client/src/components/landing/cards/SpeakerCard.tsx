import React from "react";

interface SpeakerCardProps {
  name: string;
  role: string;
  description: string;
  image: string;
  frameColor?: string;
  isTopPadded?: boolean;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  name,
  role,
  description,
  image,
  frameColor = "var(--color-light)",
  isTopPadded = false,
}) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: 356,
      width: "100%",
      marginTop: isTopPadded ? 40 : 0,
    }}>
      {/* Tag */}
      <div style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-light)",
        padding: "6px 18px",
        borderRadius: "20px 20px 0 0",
        border: "2px solid var(--color-dark)",
        borderBottom: "none",
        zIndex: 2,
      }}>
        <p className="style-p6" style={{ color: "var(--color-light)" }}>{role}</p>
      </div>

      {/* Image Container with Viewfinder Accents */}
      <div style={{
        width: "100%",
        height: 380,
        backgroundColor: frameColor,
        border: "2px solid var(--color-dark)",
        boxShadow: "5px 5px 0px var(--color-dark)",
        position: "relative",
        overflow: "hidden",
      }}>
        <img
          src={image}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Frame Corners */}
        <div style={{ position: "absolute", top: 10, left: 10, width: 12, height: 12, borderTop: "3px solid var(--color-dark)", borderLeft: "3px solid var(--color-dark)" }} />
        <div style={{ position: "absolute", top: 10, right: 10, width: 12, height: 12, borderTop: "3px solid var(--color-dark)", borderRight: "3px solid var(--color-dark)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 10, width: 12, height: 12, borderBottom: "3px solid var(--color-dark)", borderLeft: "3px solid var(--color-dark)" }} />
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 12, height: 12, borderBottom: "3px solid var(--color-dark)", borderRight: "3px solid var(--color-dark)" }} />
      </div>

      {/* Description */}
      <div style={{
        width: "92%",
        backgroundColor: "var(--color-light)",
        border: "2px solid var(--color-dark)",
        borderTop: "none",
        padding: "16px",
        boxShadow: "4px 4px 0px var(--color-dark)",
        marginTop: -2,
        zIndex: 2,
      }}>
        <h4 className="style-p2" style={{ fontSize: 24, marginBottom: 4 }}>{name}</h4>
        <p className="style-p5" style={{ opacity: 0.85 }}>{description}</p>
      </div>
    </div>
  );
};