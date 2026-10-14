import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api.js";

const AttendeeExpos = () => {
  const [expos, setExpos] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expoRes, regRes] = await Promise.all([
          api.get("/expos"),
          api.get("/registrations/my"),
        ]);
        setExpos(expoRes.data);
        setRegistrations(regRes.data);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to load expos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isRegistered = (expoId) =>
    registrations.some((r) => r.type === "expo" && r.expo?._id === expoId && r.registered);

  const handleRegister = async (expoId) => {
    setError("");
    setSuccess("");
    try {
      await api.post("/registrations", { expo: expoId });
      setSuccess("Successfully registered for expo!");
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Registration failed");
    }
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading trade show expos...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <span style={{ backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ EXPO DIRECTORY ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          UPCOMING TRADE SHOWS & EXPOS
        </h1>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          Error: {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          Success: {success}
        </div>
      )}

      {/* Expo Cards Grid */}
      {expos.length === 0 ? (
        <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
          No expos available yet.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {expos.map((expo, idx) => {
            const registered = isRegistered(expo._id);
            const bannerColors = ["var(--color-primary, #ff3e33)", "var(--color-selective-yellow, #feb804)", "var(--color-purple-mimosa, #a67eff)", "var(--color-kiwi, #abf139)"];
            const bannerBg = bannerColors[idx % bannerColors.length];

            return (
              <motion.div
                key={expo._id}
                whileHover={{ y: -6, boxShadow: "8px 8px 0px var(--color-dark, #231e25)" }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid var(--color-dark, #231e25)",
                  boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* 4 Corner Viewfinders */}
                <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />
                <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />

                {/* Banner Header */}
                <div
                  style={{
                    backgroundColor: bannerBg,
                    color: bannerBg === "var(--color-selective-yellow, #feb804)" || bannerBg === "var(--color-kiwi, #abf139)" ? "#000" : "#fff",
                    borderBottom: "2.5px solid var(--color-dark, #231e25)",
                    padding: "10px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.5 }}>
                    {expo.theme || "INDUSTRY EXPO"}
                  </span>
                  {registered && (
                    <span style={{ backgroundColor: "#000", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 2 }}>
                      CLAIMED
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--color-dark, #231e25)", margin: "0 0 8px 0", lineHeight: 0.95 }}>
                      {expo.title}
                    </h3>
                    <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280", fontWeight: 700, marginBottom: 12 }}>
                      Dates: {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()} <br />
                      Location: {expo.location || "TBA"}
                    </div>
                    {expo.description && (
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#4b5563", lineHeight: 1.45, margin: 0 }}>
                        {expo.description.substring(0, 110)}...
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, borderTop: "1.5px dashed var(--color-dark, #231e25)", paddingTop: 14 }}>
                    <Link
                      to={`/attendee/expos/${expo._id}`}
                      style={{
                        backgroundColor: "var(--color-dark, #231e25)",
                        color: "var(--color-light, #fff8eb)",
                        border: "2px solid var(--color-dark, #231e25)",
                        padding: "8px 14px",
                        borderRadius: 3,
                        textDecoration: "none",
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 12,
                        fontWeight: 800,
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      View Floor Plan
                    </Link>

                    {registered ? (
                      <span
                        style={{
                          backgroundColor: "var(--color-kiwi, #abf139)",
                          color: "#000",
                          border: "2px solid var(--color-dark, #231e25)",
                          padding: "8px 14px",
                          borderRadius: 3,
                          fontFamily: "'Satoshi', sans-serif",
                          fontSize: 12,
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(expo._id)}
                        style={{
                          backgroundColor: "var(--color-primary, #ff3e33)",
                          color: "#fff",
                          border: "2px solid var(--color-dark, #231e25)",
                          padding: "8px 14px",
                          borderRadius: 3,
                          fontFamily: "'Satoshi', sans-serif",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        + Register
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendeeExpos;