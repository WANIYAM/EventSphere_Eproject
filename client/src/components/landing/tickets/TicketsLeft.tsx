import React from "react";
import { QrCodeGraphic } from "../common/Icons";

interface TicketsLeftProps {
  date?: string;
  month?: string;
  qrCodeNumber?: string;
  buttonText?: string;
}

export const TicketsLeft: React.FC<TicketsLeftProps> = ({
  date = "05-04-25",
  month = "SEPTEMBER",
  qrCodeNumber = "#0012 32452",
}) => {
  return (
    <div style={{
      flex: "1 1 240px",
      backgroundColor: "var(--color-kiwi)",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRight: "3px dashed var(--color-dark)",
    }}>
      <div>
        <span className="style-p6" style={{ textTransform: "uppercase" }}>ADMIT ONE • GENERAL</span>
        <h3 className="style-display" style={{ fontSize: 52, margin: "12px 0 0 0" }}>{date}</h3>
        <p className="style-p3b" style={{ fontSize: 24 }}>{month}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
        <QrCodeGraphic size={70} />
        <div>
          <p className="style-p6" style={{ fontSize: 13 }}>TICKET NO.</p>
          <p className="style-p4" style={{ fontWeight: 700 }}>{qrCodeNumber}</p>
        </div>
      </div>
    </div>
  );
};