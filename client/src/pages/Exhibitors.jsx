import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

const BASE = "http://localhost:5000";

export default function Exhibitors() {
  const [exhibitors, setExhibitors] = useState([]);
  const [categories, setCategories] = useState(["All categories"]);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== "All categories") params.category = selectedCategory;

      const res = await api.get("/public/exhibitors", { params });
      const data = res.data || [];
      setExhibitors(data);

      // Derive categories dynamically from loaded data when viewing all
      if (selectedCategory === "All categories" && !search.trim()) {
        const found = Array.from(
          new Set(
            data
              .map((e) => e.category)
              .filter((c) => c && typeof c === "string" && c.trim() !== "")
          )
        ).sort();
        setCategories(["All categories", ...found]);
      }
    } catch (err) {
      console.error("Failed to load exhibitors:", err);
      setError(err.userMessage || err.response?.data?.message || "Failed to load exhibitors directory.");
      setExhibitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitors();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExhibitors();
  };

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "110px clamp(16px, 4vw, 56px) 60px clamp(16px, 4vw, 56px)" }}>
        
        {/* Header Banner */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "var(--color-purple-mimosa, #a67eff)",
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            <span>VERIFIED INDUSTRY PARTNERS</span>
          </div>

          <h1
            className="style-display"
            style={{
              fontSize: "clamp(48px, 7vw, 92px)",
              color: "var(--color-dark, #231e25)",
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: 2,
            }}
          >
            EXHIBITOR DIRECTORY
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "#4b5563", marginTop: 8, maxWidth: 640 }}>
            Explore verified exhibitors, innovative product showcases, and booth locations across all trade shows.
          </p>
        </div>

        {/* Search & Dynamic Category Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 10, maxWidth: 640 }}>
            <input
              type="text"
              placeholder="Search by company name, products, or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 18px",
                border: "2.5px solid var(--color-dark, #231e25)",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                outline: "none",
                backgroundColor: "#ffffff",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "var(--color-dark, #231e25)",
                color: "#ffffff",
                border: "2.5px solid #000",
                padding: "0 22px",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                letterSpacing: 1,
                cursor: "pointer",
              }}
            >
              SEARCH
            </button>
          </form>

          {/* Dynamic Categories */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 30,
                    backgroundColor: active ? "var(--color-dark, #231e25)" : "#ffffff",
                    color: active ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                    border: "2px solid var(--color-dark, #231e25)",
                    boxShadow: active ? "3px 3px 0px var(--color-primary, #ff3e33)" : "2px 2px 0px var(--color-dark, #231e25)",
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    letterSpacing: 0.5,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", border: "2px solid red", padding: 16, marginBottom: 24, fontWeight: 700 }}>
            Notice: {error}
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, padding: 40 }}>
            Loading exhibitor showcase...
          </p>
        ) : exhibitors.length === 0 ? (
          <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 48, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
            No exhibitors found matching your query.
          </div>
        ) : (
          /* Grid scaled safely for 320px viewports without horizontal overflow */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: "28px",
            }}
          >
            <AnimatePresence mode="popLayout">
              {exhibitors.map((ex, idx) => (
                <motion.div
                  key={ex._id || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -6, boxShadow: "8px 8px 0px var(--color-dark, #231e25)" }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "3px solid var(--color-dark, #231e25)",
                    boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 280,
                    position: "relative",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span
                        style={{
                          backgroundColor: "var(--color-purple-mimosa, #a67eff)",
                          color: "#ffffff",
                          padding: "3px 10px",
                          borderRadius: 3,
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        {ex.category || "General"}
                      </span>

                      {ex.boothNumber && (
                        <span
                          style={{
                            backgroundColor: "var(--color-primary, #ff3e33)",
                            color: "#ffffff",
                            padding: "3px 10px",
                            borderRadius: 3,
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          BOOTH {ex.boothNumber}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 6,
                          border: "2px solid #000",
                          backgroundColor: "var(--color-light, #fff8eb)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                    {ex.logo ? (
  <img 
    src={ex.logo.startsWith("http") ? ex.logo : `${BASE}${ex.logo.startsWith("/") ? "" : "/"}${ex.logo}`} 
    alt={ex.company} 
    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
  />
) : (
  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'Satoshi', sans-serif" }}>EXPO</span>
)}
                      </div>

                      <div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0, lineHeight: 1 }}>
                          {ex.company || ex.name}
                        </h3>
                        {ex.name && ex.company && ex.name !== ex.company && (
                          <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
                            Representative: {ex.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#4b5563", lineHeight: 1.45, margin: "6px 0 14px 0" }}>
                      {(ex.description || ex.products || "Showcasing industry solutions and technological innovations.").substring(0, 110)}...
                    </p>
                  </div>

                  <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, color: "#6b7280" }}>
                      Verified Partner
                    </span>

                    <Link
                      to={`/exhibitors/${ex._id}`}
                      style={{
                        backgroundColor: "var(--color-dark, #231e25)",
                        color: "var(--color-light, #fff8eb)",
                        border: "2px solid #000",
                        padding: "8px 16px",
                        borderRadius: 3,
                        textDecoration: "none",
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        letterSpacing: 0.5,
                      }}
                    >
                      VIEW PROFILE
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}