import React from "react";
import { NavButton } from "../common/NavButton";

interface MenuProps {
  activePage?: string;
}

export const Menu: React.FC<MenuProps> = ({ activePage = "Home" }) => {
  const links = [
    { name: "About us", href: "#about", bg: "var(--color-light)" },
    { name: "Agenda", href: "#agenda", bg: "var(--color-light)" },
    { name: "Gallery", href: "#gallery", bg: "var(--color-light-salmon)" },
    { name: "Speakers", href: "#speakers", bg: "var(--color-kiwi)" },
    { name: "Tickets", href: "#tickets", bg: "var(--color-vista-blue)" },
    { name: "Contact", href: "#footer", bg: "var(--color-selective-yellow)" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {links.map((link) => (
        <NavButton
          key={link.name}
          navText={link.name}
          bgColor={link.bg}
          link={link.href}
          active={activePage.toLowerCase() === link.name.toLowerCase()}
          onClick={(e) => handleSmoothScroll(e, link.href)}
        />
      ))}
    </nav>
  );
};