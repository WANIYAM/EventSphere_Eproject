import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";

const MySchedule = () => {
  const { socket } = useSocket();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleScheduleUpdated = () => fetchRegistrations();
    socket.on("schedule:updated", handleScheduleUpdated);
    return () => socket.off("schedule:updated", handleScheduleUpdated);
  }, [socket]);

  const expoRegs = registrations.filter((r) => r.type === "expo" && r.registered);
  const sessionRegs = registrations
    .filter((r) => r.type === "session" && r.registered)
    .sort((a, b) => new Date(a.session?.startTime) - new Date(b.session?.startTime));
  const bookmarks = registrations
    .filter((r) => r.type === "session" && r.bookmarked)
    .sort((a, b) => new Date(a.session?.startTime) - new Date(b.session?.startTime));

  const handleCancel = async (regId) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess("Registration cancelled successfully");
      fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed");
    }
  };

  const handleRemoveBookmark = async (sessionId) => {
    setError("");
    try {
      await api.put("/registrations/bookmark", { session: sessionId });
      fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading personal itinerary...</p>;

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
        <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ MY PERSONAL TIMETABLE ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          REGISTERED EXPOS & SESSIONS
        </h1>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ✓ {success}
        </div>
      )}

      {/* Section 1: Registered Expos */}
      <div
        style={{
          backgroundColor: "var(--color-light, #fff8eb)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 16px 0" }}>
          REGISTERED EXPO PASSES ({expoRegs.length})
        </h3>

        {expoRegs.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280" }}>
            No expo passes claimed yet. <Link to="/attendee/expos" style={{ color: "var(--color-primary, #ff3e33)", fontWeight: 700 }}>Browse available expos →</Link>
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {expoRegs.map((r) => (
              <div
                key={r._id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid var(--color-dark, #231e25)",
                  boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 800, margin: 0 }}>
                    {r.expo?.title || "Expo"}
                  </h4>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#6b7280", margin: "4px 0 0 0", fontWeight: 600 }}>
                    📅 {r.expo?.startDate && new Date(r.expo.startDate).toLocaleDateString()} – {r.expo?.endDate && new Date(r.expo.endDate).toLocaleDateString()}
                    {r.expo?.location && ` • 📍 ${r.expo.location}`}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Link to={`/attendee/expos/${r.expo?._id}`} style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, color: "var(--color-dark, #231e25)" }}>
                    Open Floor Plan →
                  </Link>
                  <button
                    onClick={() => handleCancel(r._id)}
                    style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontSize: 11, fontWeight: 800 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Registered Sessions */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 16px 0" }}>
          REGISTERED SESSIONS & WORKSHOPS ({sessionRegs.length})
        </h3>

        {sessionRegs.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280" }}>No sessions registered yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessionRegs.map((r) => (
              <div
                key={r._id}
                style={{
                  backgroundColor: "var(--color-light, #fff8eb)",
                  border: "2px solid var(--color-dark, #231e25)",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: 0 }}>
                    {r.session?.title || "Session"}
                  </h4>
                  {r.session?.speaker && <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-primary, #ff3e33)" }}>🎤 {r.session.speaker}</span>}
                  <div style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", marginTop: 2 }}>
                    ⏰ {r.session?.startTime && new Date(r.session.startTime).toLocaleString()} • 📍 {r.session?.location || "TBA"}
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(r._id)}
                  style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 800 }}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Bookmarked Sessions */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 16px 0", color: "var(--color-dark, #231e25)" }}>
          ★ BOOKMARKED KEYNOTES & TALKS ({bookmarks.length})
        </h3>

        {bookmarks.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280" }}>No bookmarked sessions.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookmarks.map((r) => (
              <div
                key={r._id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid var(--color-dark, #231e25)",
                  boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: 0 }}>
                    {r.session?.title || "Session"}
                  </h4>
                  {r.session?.speaker && <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-primary, #ff3e33)" }}>🎤 {r.session.speaker}</span>}
                  <div style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", marginTop: 2 }}>
                    ⏰ {r.session?.startTime && new Date(r.session.startTime).toLocaleString()} • 📍 {r.session?.location || "TBA"}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(r.session?._id)}
                  style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontSize: 13, fontWeight: 800 }}
                  title="Remove Bookmark"
                >
                  ★ Saved
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySchedule;