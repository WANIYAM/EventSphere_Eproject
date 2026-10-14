import React from "react";

export const RetroTvLogo: React.FC = () => (
  <div style={{
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "var(--color-cerulean)",
    border: "2px solid var(--color-dark)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "2px 2px 0px var(--color-dark)"
  }}>
    <div style={{ width: 26, height: 20, backgroundColor: "var(--color-dark)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 8, height: 8, backgroundColor: "var(--color-kiwi)", borderRadius: 2 }} />
    </div>
  </div>
);