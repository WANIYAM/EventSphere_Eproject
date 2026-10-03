import React from "react";

interface AboutCardProps {
  number: string;
  title: string;
  description: string;
  bgColor?: string;
}

export const AboutCard: React.FC<AboutCardProps> = ({
  number,
  title,
  description,
  bgColor = "var(--color-kiwi)"
}) => {
  return (
    <div style={{
      backgroundColor: bgColor,
      border: "3px solid var(--color-dark)",
      boxShadow: "8px 8px 0px var(--color-dark)",
      padding: "36px 32px",
      transform: "rotate(2deg)"
    }}>
      <span className="style-display" style={{ fontSize: 64, color: "var(--color-dark)" }}>{number}</span>
      <h3 className="style-p2" style={{ margin: "12px 0 16px 0" }}>{title}</h3>
      <p className="style-p3">{description}</p>
    </div>
  );
};