import React from "react";

interface RecordingCardProps {
  tagText: string;
  title: string;
  name: string;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({
  tagText,
  title,
  name,
}) => {
  return (
    <div style={{
      backgroundColor: "var(--color-kiwi)",
      border: "2px solid var(--color-dark)",
      boxShadow: "4px 4px 0px var(--color-dark)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 350
    }}>
      <span style={{
        display: "inline-block",
        padding: "4px 10px",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-light)",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 700,
        width: "fit-content"
      }}>
        {tagText}
      </span>
      <h3 className="style-p2">{title}</h3>
      <p className="style-p6">Speaker: {name}</p>
    </div>
  );
};