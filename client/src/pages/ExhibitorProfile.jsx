import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

const BASE = "http://localhost:5000";

export default function ExhibitorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        // Strictly uses public endpoint; no fallbacks to login-protected routes
        const res = await api.get(`/public/exhibitors/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load exhibitor profile:", err);
        setError(err.userMessage || err.response?.data?.message || "Exhibitor profile could not be loaded.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleContactClick = () => {
    const companyName = profile?.company || profile?.name || "Exhibitor";
    const targetUrl = `/messages?to=${profile._id}&name=${encodeURIComponent(companyName)}`;
    if (user) {
      navigate(targetUrl);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 800, fontSize: 18 }}>
          Loading exhibitor profile...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
        <CustomCursor />
        <Navigation />
        <main style={{ maxWidth: 640, margin: "140px auto 0 auto", padding: 32, backgroundColor: "#fff", border: "3px solid #000" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--color-primary, #ff3e33)", margin: "0 0 10px 0" }}>NOTICE</h3>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "#374151" }}>{error || "Exhibitor not found."}</p>
          <Link
            to="/exhibitors"
            style={{
              display: "inline-block",
              marginTop: 16,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "#fff",
              padding: "10px 20px",
              textDecoration: "none",
              fontWeight: 800,
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            Back to Exhibitors Directory
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "130px clamp(16px, 4vw, 48px) 60px clamp(16px, 4vw, 48px)" }}>
        
        {/* Back Link */}
        <Link
          to="/exhibitors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            border: "2px solid #000",
            boxShadow: "2px 2px 0px #000",
            padding: "8px 16px",
            borderRadius: 4,
            textDecoration: "none",
            color: "#000",
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 800,
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          BACK TO DIRECTORY
        </Link>

        {/* Hero Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3.5px solid var(--color-dark, #231e25)",
            boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
            padding: "clamp(24px, 4vw, 40px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 8,
                border: "2.5px solid #000",
                backgroundColor: "var(--color-light, #fff8eb)",
                boxShadow: "3px 3px 0px #000",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {profile.logo ? (
                <img src={`${BASE}${profile.logo}`} alt={profile.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Satoshi', sans-serif" }}>EXHIBITOR</span>
              )}
            </div>

            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <span style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                  {profile.category || "Technology"}
                </span>
                <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800 }}>
                  VERIFIED EXHIBITOR
                </span>
              </div>

              <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: "clamp(40px, 5.5vw, 60px)", margin: "4px 0", lineHeight: 0.9 }}>
                {profile.company || profile.name}
              </h1>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--color-primary, #ff3e33)", textDecoration: "none", marginTop: 4, display: "inline-block" }}
                >
                  Website: {profile.website}
                </a>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleContactClick}
            style={{
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              border: "2.5px solid #000",
              boxShadow: "4px 4px 0px #000",
              padding: "14px 28px",
              borderRadius: 4,
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            CONTACT EXHIBITOR {user ? "" : "(LOGIN REQUIRED)"}
          </motion.button>
        </div>

        {/* Company Overview */}
        {profile.description && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid #000",
              boxShadow: "5px 5px 0px #000",
              padding: "28px 32px",
              marginBottom: 28,
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 12px 0" }}>
              COMPANY OVERVIEW
            </h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, lineHeight: 1.6, color: "#374151", margin: 0 }}>
              {profile.description}
            </p>
          </div>
        )}

        {/* Products & Innovations */}
        {profile.products && (
          <div
            style={{
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "3px solid #000",
              boxShadow: "5px 5px 0px #000",
              padding: "28px 32px",
              marginBottom: 28,
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 12px 0" }}>
              PRODUCTS AND INNOVATIONS
            </h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
              {profile.products}
            </p>
          </div>
        )}

        {/* Participating Trade Shows & Booth Allocations */}
        {profile.expos && profile.expos.length > 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid #000",
              boxShadow: "5px 5px 0px #000",
              padding: "28px 32px",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 16px 0" }}>
              TRADE SHOW BOOTHS AND SCHEDULES
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {profile.expos.map((e, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "2px solid #000",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 800, margin: 0 }}>
                      {e.expo?.title || e.title || "Trade Show Expo"}
                    </h4>
                    <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>
                      Location: {e.expo?.location || "Main Convention Center"}
                      {e.expo?.startDate && ` | Dates: ${new Date(e.expo.startDate).toLocaleDateString()}`}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "4px 12px", borderRadius: 3, fontWeight: 800, fontSize: 12 }}>
                      {e.booth?.boothNumber ? `BOOTH ${e.booth.boothNumber}` : (e.boothNumber ? `BOOTH ${e.boothNumber}` : "SPACE ASSIGNED")}
                    </span>
                    {e.expo?._id && (
                      <Link
                        to={`/expos/${e.expo._id}`}
                        style={{
                          backgroundColor: "#000",
                          color: "#fff",
                          padding: "5px 12px",
                          borderRadius: 3,
                          textDecoration: "none",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        VIEW EXPO
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}