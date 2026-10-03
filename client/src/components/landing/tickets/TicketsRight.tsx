import React from "react";
import { CTAButton } from "../common/CTAButton";

interface TicketsRightProps {
  title?: string;
  tagText?: string;
  venueTime?: string;
}

export const TicketsRight: React.FC<TicketsRightProps> = ({
  title = "FESTIVAL TICKET",
  tagText = "TECHSPRINT 48H • 2025 PASS",
  venueTime = "KOMCA DPS 1, Penang • 10:00 to 18:00",
}) => {
  return (
    <div style={{
      flex: "2 1 480px",
      padding: "36px 32px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "var(--color-light)",
    }}>
      <div>
        <div style={{
          display: "inline-block",
          padding: "4px 10px",
          backgroundColor: "var(--color-dark)",
          color: "var(--color-light)",
          borderRadius: 4,
          marginBottom: 12,
        }}>
          <span className="style-p6" style={{ fontSize: 12, color: "var(--color-light)" }}>{tagText}</span>
        </div>

        <h2 className="style-display" style={{ fontSize: "clamp(48px, 6vw, 76px)", color: "var(--color-primary)" }}>
          {title}
        </h2>
        <p className="style-p3" style={{ marginTop: 8 }}>
          Full 3-day access to keynote stages, interactive workshops, code jam sessions, and the opening gala.
        </p>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 32,
        paddingTop: 24,
        borderTop: "2px solid var(--color-dark)",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <p className="style-p6">VENUE & SCHEDULE</p>
          <p className="style-p4" style={{ fontWeight: 700 }}>{venueTime}</p>
        </div>
        <CTAButton
          buttonText="Grab Pass ($49)"
          bgColor="var(--color-selective-yellow)"
          link="https://www.lemonsqueezy.com/"
          newTab
        />
      </div>
    </div>
  );
};