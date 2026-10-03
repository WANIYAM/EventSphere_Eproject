import React from "react";
import { TicketsLeft } from "./TicketsLeft";
import { TicketsRight } from "./TicketsRight";

export const TicketSection: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "stretch",
      width: "100%",
      maxWidth: 960,
      margin: "0 auto",
      boxShadow: "8px 8px 0px var(--color-dark)",
      border: "3px solid var(--color-dark)",
      backgroundColor: "var(--color-light)",
    }}>
      <TicketsLeft />
      <TicketsRight />
    </div>
  );
};