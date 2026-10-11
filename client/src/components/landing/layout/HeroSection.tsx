import React from "react";
import { CTAButton } from "../common/CTAButton";

export const HeroSection: React.FC = () => {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "160px 24px 80px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Floating Badges */}
      <div style={{
        position: "absolute",
        top: "22%",
        left: "8%",
        backgroundColor: "var(--color-vista-blue)",
        border: "2px solid var(--color-dark)",
        boxShadow: "4px 4px 0px var(--color-dark)",
        padding: "8px 20px",
        borderRadius: 40,
        transform: "rotate(-12deg)",
        zIndex: 2,
      }}>
        <span className="style-p3b" style={{ color: "var(--color-dark)" }}>EMPOWER MUSIC MAKERS</span>
      </div>

      <div style={{
        position: "absolute",
        bottom: "22%",
        right: "8%",
        backgroundColor: "var(--color-cerulean)",
        border: "2px solid var(--color-dark)",
        boxShadow: "4px 4px 0px var(--color-dark)",
        padding: "8px 20px",
        borderRadius: 40,
        transform: "rotate(10deg)",
        zIndex: 2,
      }}>
        <span className="style-p3b" style={{ color: "var(--color-light)" }}>TECH & INTERACTIVE ART</span>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h1 className="style-display" style={{ color: "var(--color-primary)" }}>
          &#123; REDEFINING &#125;
        </h1>
        <h1 className="style-display" style={{ color: "var(--color-dark)" }}>
          YOUR GROWTH
        </h1>
        <p className="style-p1" style={{ maxWidth: 760, margin: "28px auto", opacity: 0.9 }}>
          Join 50+ visionary creators, artists, and engineers for 3 days of sound experiments, future interfaces, and radical code.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
          <CTAButton
            buttonText="Grab Your Pass"
            bgColor="var(--color-primary)"
            textColor="var(--color-light)"
            link="#tickets"
          />
          <CTAButton
            variant="Scroll"
            buttonText="Explore Agenda"
            bgColor="var(--color-light)"
            link="#agenda"
          />
        </div>
      </div>
    </section>
  );
};