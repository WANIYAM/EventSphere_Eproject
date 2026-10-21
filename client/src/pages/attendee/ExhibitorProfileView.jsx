import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api.js";

const BASE = "http://localhost:5000";
const ITEMS_PER_PAGE = 4;

const ExhibitorProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/exhibitors/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading exhibitor showcase...</p>;
  if (error) return <div style={{ backgroundColor: "#fee2e2", border: "2px solid red", padding: 16 }}>{error}</div>;
  if (!profile) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Exhibitor profile not found.</p>;

  const exposList = profile.expos || [];
  const totalPages = Math.ceil(exposList.length / ITEMS_PER_PAGE) || 1;
  const currentExpos = exposList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header / Back */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#ffffff",
            border: "2px solid var(--color-dark, #231e25)",
            boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
            padding: "6px 14px",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          Back to Directory
        </button>
      </div>

      {/* Exhibitor Passport Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          {/* Logo Frame */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 8,
              border: "2.5px solid var(--color-dark, #231e25)",
              backgroundColor: "var(--color-light, #fff8eb)",
              boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profile.logo ? (
              <img src={`${BASE}${profile.logo}`} alt={profile.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 12, fontWeight: 800 }}>No logo</span>
            )}
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              {profile.category && (
                <span style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                  {profile.category}
                </span>
              )}
              <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                APPROVED EXHIBITOR
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 5vw, 52px)", margin: 0, lineHeight: 0.9 }}>
              {profile.company || profile.name}
            </h1>

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--color-primary, #ff3e33)", textDecoration: "none", marginTop: 4, display: "inline-block" }}
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/messages?to=${profile._id}&name=${encodeURIComponent(profile.company || profile.name)}`)}
          style={{
            backgroundColor: "var(--color-primary, #ff3e33)",
            color: "#ffffff",
            border: "2.5px solid var(--color-dark, #231e25)",
            boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
            padding: "12px 24px",
            borderRadius: 4,
            fontFamily: "var(--font-display)",
            fontSize: 20,
            letterSpacing: 1,
            cursor: "pointer",
          }}
        >
          CONTACT EXHIBITOR / BOOK DEMO
        </motion.button>
      </div>

      {/* About Description */}
      {profile.description && (
        <div
          style={{
            backgroundColor: "var(--color-light, #fff8eb)",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
            padding: "24px 28px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 10px 0" }}>
            ABOUT THE COMPANY
          </h3>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, lineHeight: 1.6, color: "#374151", margin: 0 }}>
            {profile.description}
          </p>
        </div>
      )}

      {/* Products & Services */}
      {profile.expos?.some((e) => e.products) && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
            padding: "24px 28px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 10px 0" }}>
            EXHIBITED PRODUCTS & INNOVATIONS
          </h3>
          {profile.expos.filter((e) => e.products).map((e, i) => (
            <div key={i} style={{ backgroundColor: "#f9fafb", border: "1.5px solid #000", padding: "12px 16px", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 600 }}>
              {e.products}
            </div>
          ))}
        </div>
      )}

      {/* Participating Expos & Booths Table with Pagination */}
      {profile.expos?.length > 0 && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
            padding: "24px 28px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 16px 0" }}>
            PARTICIPATING TRADE SHOWS & BOOTH LOCATIONS
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", border: "1.5px solid #000" }}>EXPO EVENT</th>
                  <th style={{ padding: "10px 14px", border: "1.5px solid #000" }}>EVENT DATES</th>
                  <th style={{ padding: "10px 14px", border: "1.5px solid #000" }}>RESERVED BOOTH</th>
                </tr>
              </thead>
              <tbody>
                {currentExpos.map((e, i) => (
                  <tr key={i}>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <strong>{e.expo?.title || "Expo"}</strong>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 600 }}>
                      {e.expo?.startDate && new Date(e.expo.startDate).toLocaleDateString()} – {e.expo?.endDate && new Date(e.expo.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "3px 10px", borderRadius: 2, fontWeight: 800, fontSize: 12 }}>
                        Booth {e.boothNumber}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: currentPage === 1 ? "#e5e7eb" : "var(--color-dark, #231e25)",
                  color: currentPage === 1 ? "#9ca3af" : "#fff",
                  border: "2px solid #000",
                  padding: "6px 14px",
                  borderRadius: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← PREV
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  style={{
                    minWidth: 36,
                    height: 36,
                    backgroundColor: currentPage === num ? "var(--color-primary, #ff3e33)" : "#ffffff",
                    color: currentPage === num ? "#ffffff" : "#000000",
                    border: "2px solid #000",
                    boxShadow: currentPage === num ? "2px 2px 0 #000" : "none",
                    borderRadius: 4,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor: currentPage === totalPages ? "#e5e7eb" : "var(--color-dark, #231e25)",
                  color: currentPage === totalPages ? "#9ca3af" : "#fff",
                  border: "2px solid #000",
                  padding: "6px 14px",
                  borderRadius: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExhibitorProfileView;