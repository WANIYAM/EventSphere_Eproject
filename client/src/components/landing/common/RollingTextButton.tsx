import React, { useState } from "react";
import { motion } from "framer-motion";

interface RollingTextButtonProps {
  buttonText: string;
  bgColor?: string;
  textColor?: string;
  shadowColor?: string;
  link?: string;
  newTab?: boolean;
  withArrow?: boolean;
}

export const RollingTextButton: React.FC<RollingTextButtonProps> = ({
  buttonText,
  bgColor = "var(--color-primary)",
  textColor = "var(--color-light)",
  shadowColor = "5px 5px 0px 0px var(--color-dark)",
  link = "#",
  newTab = false,
  withArrow = false,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        x: hovered ? 3 : 0,
        y: hovered ? 3 : 0,
        boxShadow: hovered ? "2px 2px 0px 0px var(--color-dark)" : shadowColor,
      }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 28px",
        borderRadius: 40,
        backgroundColor: bgColor,
        color: textColor,
        textDecoration: "none",
        border: "2px solid var(--color-dark)",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 2-line Roll Container */}
      <div style={{ height: 26, overflow: "hidden", position: "relative" }}>
        <motion.div
          animate={{ y: hovered ? -26 : 0 }}
          transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <span className="style-p3" style={{ color: textColor, lineHeight: "26px", display: "block" }}>
            {buttonText}
          </span>
          <span className="style-p3" style={{ color: textColor, lineHeight: "26px", display: "block" }}>
            {buttonText}
          </span>
        </motion.div>
      </div>

      {withArrow && (
        <motion.span
          animate={{ y: hovered ? 3 : 0, rotate: hovered ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </motion.span>
      )}
    </motion.a>
  );
};