import React from "react";
import { RecordingCard } from "../cards/RecordingCard";

const EXPO_RECORDINGS = [
  {
    tagText: "KEYNOTE • 45 MIN",
    title: "Automating Large-Scale Expo Operations & Booth Allocations",
    name: "Sofia Rahman (Operations Lead)",
  },
  {
    tagText: "WORKSHOP • 60 MIN",
    title: "Exhibitor B2B Lead Capture & Smart Floor Plan Optimization",
    name: "Noah Islam (Exhibitor Relations)",
  },
  {
    tagText: "PANEL • 50 MIN",
    title: "The Future of Hybrid Trade Shows & Real-Time Engagement Analytics",
    name: "Ethan Karim (Platform Architect) & Guests",
  },
];

export const RecordingsSection: React.FC = () => {
  return (
    <section
      id="recordings"
      style={{
        backgroundColor: "transparent",
        padding: "100px clamp(20px, 4vw, 56px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: "var(--color-cerulean)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            SESSION ARCHIVE // ON-DEMAND REPLAYS
          </p>
          <h2 className="style-display" style={{ fontSize: "clamp(42px, 6vw, 84px)", color: "var(--color-dark)", margin: 0 }}>
            EXPO &#123; RECORDINGS &#125; & MASTERCLASSES
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            justifyItems: "center",
          }}
        >
          {EXPO_RECORDINGS.map((rec, i) => (
            <RecordingCard
              key={i}
              tagText={rec.tagText}
              title={rec.title}
              name={rec.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
