import React from "react";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
];

export const GallerySection: React.FC = () => {
  return (
    <section id="gallery" style={{
      padding: "60px 0",
      backgroundColor: "var(--color-dark)",
      color: "var(--color-light)",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto 30px auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
        <div>
          <p className="style-p6" style={{ color: "var(--color-kiwi)" }}>EXPERIENCES</p>
          <h2 className="style-display" style={{ fontSize: "clamp(36px, 5vw, 60px)", color: "var(--color-light)" }}>
            25 YEARS IN &#123; 2025 &#125;
          </h2>
        </div>
        <p className="style-p4" style={{ maxWidth: 360, opacity: 0.8 }}>
          A quarter century of student showcases and boundary-pushing audio-visual stages.
        </p>
      </div>

      <div style={{ display: "flex", gap: 20, overflow: "hidden" }}>
        <div className="marquee-track" style={{ gap: 20 }}>
          {GALLERY_IMAGES.map((src, idx) => (
            <div
              key={idx}
              style={{
                width: 320,
                height: 240,
                flexShrink: 0,
                border: "2px solid var(--color-light)",
                boxShadow: "4px 4px 0px var(--color-kiwi)",
                overflow: "hidden",
              }}
            >
              <img src={src} alt="Event highlight" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};