import React, { useState } from "react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"Default" | "Loading" | "Success">("Default");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setFormState("Loading");
    setTimeout(() => {
      setFormState("Success");
      setEmail("");
    }, 800);
  };

  return (
    <footer style={{
      backgroundColor: "var(--color-primary)",
      color: "var(--color-light)",
      borderTop: "3px solid var(--color-dark)",
      padding: "100px 32px 40px 32px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
          <div>
            <p className="style-p5" style={{ textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, opacity: 0.9 }}>Get In Touch</p>
            <a href="mailto:hello@pixelstage.org" className="style-p2" style={{ color: "var(--color-light)", textDecoration: "none", display: "block" }}>
              hello@pixelstage.org
            </a>
            <p className="style-p6" style={{ marginTop: 8 }}>+60 4-653 8888 (CS USM)</p>
          </div>

          <div>
            <p className="style-p5" style={{ textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, opacity: 0.9 }}>Navigation</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["About us", "Agenda", "Gallery", "Speakers", "Buy tickets"].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "")}`} className="style-p6" style={{ color: "var(--color-light)", textDecoration: "none" }}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="style-p5" style={{ textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, opacity: 0.9 }}>Social Media</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["YouTube", "Instagram", "TikTok", "X / Twitter", "LinkedIn"].map(soc => (
                <a key={soc} href="#" className="style-p6" style={{ color: "var(--color-light)", textDecoration: "none" }}>
                  {soc}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="style-p5" style={{ textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, opacity: 0.9 }}>Stay in the Loop</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{
                display: "flex",
                border: "2px solid var(--color-light)",
                borderRadius: 40,
                padding: "6px 8px 6px 16px",
                backgroundColor: "rgba(255,255,255,0.12)"
              }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === "Loading"}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--color-light)",
                    fontSize: 16,
                    fontFamily: "var(--font-body)",
                  }}
                />
                <button
                  type="submit"
                  disabled={formState === "Loading"}
                  style={{
                    backgroundColor: "var(--color-light)",
                    color: "var(--color-dark)",
                    border: "none",
                    borderRadius: 30,
                    padding: "8px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {formState === "Loading" ? "..." : formState === "Success" ? "✓ Done" : "Join"}
                </button>
              </div>
              {formState === "Success" && (
                <p className="style-p6" style={{ color: "var(--color-kiwi)" }}>Thank you! You are on the festival guestlist.</p>
              )}
            </form>
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          borderTop: "1px solid rgba(255, 248, 235, 0.4)",
          paddingTop: 24,
        }}>
          <p className="style-p6" style={{ opacity: 0.85 }}>© 2025 PixelStage Conference. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" className="style-p6" style={{ color: "var(--color-light)", textDecoration: "none" }}>Terms & Conditions</a>
            <span>/</span>
            <a href="#" className="style-p6" style={{ color: "var(--color-light)", textDecoration: "none" }}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};