import React, { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  rotation?: number;
}

export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  defaultOpen = false,
  rotation = -2,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto", position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "24px 28px",
          backgroundColor: "var(--color-light)",
          border: "2px solid var(--color-dark)",
          boxShadow: isOpen ? "none" : "4px 4px 0px var(--color-dark)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          transition: "all 0.15s ease",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span className="style-p2" style={{ fontSize: "clamp(20px, 3vw, 28px)" }}>{question}</span>
        <span style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          backgroundColor: isOpen ? "var(--color-primary)" : "var(--color-kiwi)",
          color: isOpen ? "var(--color-light)" : "var(--color-dark)",
          border: "2px solid var(--color-dark)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 700,
          transform: isOpen ? "rotate(45deg)" : "none",
          transition: "transform 0.2s ease, background-color 0.2s ease",
          flexShrink: 0
        }}>
          +
        </span>
      </button>

      {isOpen && (
        <div style={{
          backgroundColor: "var(--color-selective-yellow)",
          border: "2px solid var(--color-dark)",
          boxShadow: "6px 6px 0px var(--color-dark)",
          padding: "36px 32px",
          transform: `rotate(${rotation}deg)`,
          marginTop: 10,
          marginBottom: 20,
          position: "relative",
          zIndex: 1,
        }}>
          <p className="style-p3" style={{ color: "var(--color-dark)" }}>{answer}</p>
        </div>
      )}
    </div>
  );
};