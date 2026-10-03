import React from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  image,
}) => {
  return (
    <div style={{
      width: "100%",
      maxWidth: 360,
      backgroundColor: "var(--color-light)",
      border: "2px solid var(--color-dark)",
      boxShadow: "5px 5px 0px var(--color-dark)",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 20,
    }}>
      <p className="style-p4" style={{ fontStyle: "italic" }}>“{quote}”</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 16, borderTop: "1.5px solid var(--color-dark)" }}>
        <img
          src={image}
          alt={name}
          style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-dark)" }}
        />
        <div>
          <h5 className="style-p4" style={{ fontWeight: 700 }}>{name}</h5>
          <p className="style-p6" style={{ opacity: 0.7 }}>{role}</p>
        </div>
      </div>
    </div>
  );
};