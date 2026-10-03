import React from "react";
import { CTAButton } from "../common/CTAButton";

interface SponsorsCardProps {
  title: string;
  logoText: string;
  bgColor: string;
  detail: string;
}

export const SponsorsCard: React.FC<SponsorsCardProps> = ({
  title,
  logoText,
  bgColor,
  detail,
}) => {
  return (
    <div style={{
      width: "100%",
      backgroundColor: bgColor,
      border: "3px solid var(--color-dark)",
      boxShadow: "6px 6px 0px var(--color-dark)",
      padding: "36px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 30,
      flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 300px" }}>
        <div style={{
          display: "inline-block",
          padding: "6px 14px",
          backgroundColor: "var(--color-dark)",
          color: "var(--color-light)",
          width: "fit-content",
          fontFamily: "var(--font-display)",
          fontSize: 22,
          letterSpacing: 1,
        }}>
          {logoText}
        </div>
        <h3 className="style-p2">{title}</h3>
        <p className="style-p4" style={{ maxWidth: 480 }}>{detail}</p>
        <CTAButton variant="Scroll" buttonText="Explore Partnership" bgColor="var(--color-light)" />
      </div>

      <div style={{
        width: 140,
        height: 140,
        borderRadius: "50%",
        border: "3px solid var(--color-dark)",
        backgroundColor: "var(--color-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "4px 4px 0px var(--color-dark)",
        transform: "rotate(6deg)",
      }}>
        <span className="style-display" style={{ fontSize: 36, textAlign: "center", lineHeight: 0.9 }}>
          PARTNER<br />2025
        </span>
      </div>
    </div>
  );
};