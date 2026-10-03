import React from "react";
import { CTAButton } from "../common/CTAButton";

export const CTACard: React.FC = () => {
  return (
    <section style={{
      width: "100%",
      backgroundColor: "var(--color-purple-mimosa)",
      borderTop: "3px solid var(--color-dark)",
      borderBottom: "3px solid var(--color-dark)",
      padding: "60px 0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 20,
    }}>
      <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="style-display" style={{ fontSize: "clamp(50px, 8vw, 92px)", marginRight: 40, color: "var(--color-dark)" }}>
              RESERVE YOUR SPOT • JOIN 2,500+ CREATORS • SHAPE THE FUTURE •
            </span>
          ))}
        </div>
      </div>

      <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        <div className="marquee-track" style={{ animationDirection: "reverse" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="style-display" style={{ fontSize: "clamp(50px, 8vw, 92px)", marginRight: 40, color: "var(--color-light)", WebkitTextStroke: "2px var(--color-dark)" }}>
              PIXELSTAGE 2025 • JULY 1-3 • PENANG MALAYSIA • GET TICKETS •
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <CTAButton
          buttonText="GET ACCESS NOW"
          bgColor="var(--color-kiwi)"
          textColor="var(--color-dark)"
          link="#tickets"
        />
      </div>
    </section>
  );
};