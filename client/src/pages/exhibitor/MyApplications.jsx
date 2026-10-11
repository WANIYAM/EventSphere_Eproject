import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api.js";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/my");
      setApplications(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
            [ BOOTH APPLICATIONS ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            MY EXPO APPLICATIONS
          </h1>
        </div>

        <Link
          to="/exhibitor/expos"
          style={{
            backgroundColor: "var(--color-primary, #ff3e33)",
            color: "#ffffff",
            border: "2px solid var(--color-dark, #231e25)",
            boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
            padding: "10px 20px",
            borderRadius: 4,
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          + BROWSE MORE EXPOS
        </Link>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <p style={{ padding: 32, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading your applications...</p>
      ) : applications.length === 0 ? (
        <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
          You haven't submitted any booth applications yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {applications.map((app) => (
            <motion.div
              key={app._id}
              whileHover={{ y: -3, boxShadow: "6px 6px 0px var(--color-dark, #231e25)" }}
              style={{
                backgroundColor: "var(--color-light, #fff8eb)",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--color-dark, #231e25)", paddingBottom: 10 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0 }}>
                  {app.expo?.title || "Trade Show Expo"}
                </h3>
                <span
                  style={{
                    backgroundColor:
                      app.status === "approved"
                        ? "var(--color-kiwi, #abf139)"
                        : app.status === "rejected"
                        ? "var(--color-primary, #ff3e33)"
                        : "var(--color-selective-yellow, #feb804)",
                    color: app.status === "rejected" ? "#fff" : "#000",
                    border: "1.5px solid #000",
                    padding: "3px 10px",
                    borderRadius: 2,
                    fontWeight: 800,
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {app.status}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
                <div>
                  <strong>Company Name:</strong> {app.companyName || "N/A"} <br />
                  <strong>Products:</strong> {app.products || "N/A"}
                </div>
                <div>
                  <strong>Expo Dates:</strong> {app.expo?.startDate && new Date(app.expo.startDate).toLocaleDateString()} - {app.expo?.endDate && new Date(app.expo.endDate).toLocaleDateString()} <br />
                  <strong>Assigned Booth:</strong>{" "}
                  {app.booth ? (
                    <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "2px 6px", borderRadius: 2, fontWeight: 800, fontSize: 11 }}>
                      Booth {app.booth.boothNumber}
                    </span>
                  ) : (
                    <span style={{ color: "#6b7280" }}>Pending Assignment</span>
                  )}
                </div>
              </div>

              {app.documents && app.documents.length > 0 && (
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>Documents:</span>
                  {app.documents.map((docPath, idx) => (
                    <a
                      key={idx}
                      href={`http://localhost:5000${docPath}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, textDecoration: "none", fontWeight: 800 }}
                    >
                      📄 Doc {idx + 1}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;