import React from "react";

export const ArrowDownIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

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

export const QrCodeGraphic: React.FC<{ size?: number }> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="var(--color-dark)">
    <rect x="0" y="0" width="30" height="30" rx="3" />
    <rect x="5" y="5" width="20" height="20" fill="var(--color-light)" rx="2" />
    <rect x="9" y="9" width="12" height="12" />
    <rect x="70" y="0" width="30" height="30" rx="3" />
    <rect x="75" y="5" width="20" height="20" fill="var(--color-light)" rx="2" />
    <rect x="79" y="9" width="12" height="12" />
    <rect x="0" y="70" width="30" height="30" rx="3" />
    <rect x="5" y="75" width="20" height="20" fill="var(--color-light)" rx="2" />
    <rect x="9" y="79" width="12" height="12" />
    <rect x="38" y="10" width="14" height="14" />
    <rect x="38" y="38" width="24" height="24" />
    <rect x="70" y="45" width="12" height="25" />
    <rect x="45" y="70" width="20" height="12" />
    <rect x="75" y="75" width="20" height="20" />
  </svg>
);