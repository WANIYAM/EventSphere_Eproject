import React, { useState } from "react";
import { ArrowDownIcon } from "./Icons";

interface CTAButtonProps {
  variant?: "Default" | "Scroll";
  textColor?: string;
  buttonText: string;
  bgColor?: string;
  shadowColor?: string;
  link?: string;
  newTab?: boolean;
  onClick?: () => void;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = "Default",
  textColor = "var(--color-dark)",
  buttonText,
  bgColor = "var(--color-light)",
  shadowColor = "5px 5px 0px 0px var(--color-dark)",
  link = "#",
  newTab = false,
  onClick,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={link}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: variant === "Scroll" ? "8px 20px" : "14px 28px",
        borderRadius: 40,
        backgroundColor: bgColor,
        color: textColor,
        textDecoration: "none",
        border: "2px solid var(--color-dark)",
        boxShadow: hover ? "2px 2px 0px 0px var(--color-dark)" : shadowColor,
        transform: hover ? "translate(3px, 3px)" : "none",
        transition: "all 0.15s ease",
        cursor: "pointer",
        width: "fit-content",
        userSelect: "none"
      }}
    >
      <span className="style-p3" style={{ color: textColor }}>{buttonText}</span>
      {variant === "Scroll" && (
        <span style={{ display: "flex", transform: hover ? "translateY(2px)" : "none", transition: "transform 0.15s ease" }}>
          <ArrowDownIcon size={18} />
        </span>
      )}
    </a>
  );
};