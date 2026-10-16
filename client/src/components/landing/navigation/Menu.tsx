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
    <nav
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        padding: "8px 0",
      }}
    >
      {links.map((link, i) => (
        <React.Fragment key={link.name}>
          <NavButton
            navText={link.name}
            bgColor={link.bg}
            link={link.href}
            active={activePage.toLowerCase() === link.name.toLowerCase()}
            onClick={(e) => handleSmoothScroll(e, link.href)}
          />
          {i < links.length - 1 && (
            <span
              aria-hidden
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "var(--color-dark, #231e25)",
                opacity: 0.35,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};