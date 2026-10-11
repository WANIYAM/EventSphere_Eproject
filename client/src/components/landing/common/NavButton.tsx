import React, { useState } from "react";

interface NavButtonProps {
  navText: string;
  bgColor?: string;
  textColor?: string;
  link?: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const NavButton: React.FC<NavButtonProps> = ({
  navText,
  bgColor = "var(--color-light)",
  textColor = "var(--color-dark)",
  link = "#",
  active = false,
  onClick,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={link}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: 40,
        backgroundColor: active ? "var(--color-dark)" : hover ? "var(--color-light-salmon)" : bgColor,
        color: active ? "var(--color-light)" : textColor,
        textDecoration: "none",
        border: "1.5px solid var(--color-dark)",
        boxShadow: "2px 2px 0px var(--color-dark)",
        cursor: "pointer",
        transition: "background-color 0.15s ease, transform 0.1s ease",
        transform: hover ? "translate(-1px, -1px)" : "none",
      }}
    >
      <span className="style-p4" style={{ color: active ? "var(--color-light)" : textColor }}>
        {navText}
      </span>
      {active && <span style={{ fontSize: 10 }}>●</span>}
    </a>
  );
};