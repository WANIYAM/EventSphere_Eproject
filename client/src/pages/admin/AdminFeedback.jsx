import { useState, useEffect } from "react";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/feedback");
        setFeedback(res.data);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const filtered = filterType ? feedback.filter((f) => f.type === filterType) : feedback;

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
          <span style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
            [ USER SENTIMENT & REVIEWS ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            USER FEEDBACK & SUGGESTIONS
          </h1>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800 }}>Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: "8px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, backgroundColor: "var(--color-light, #fff8eb)" }}
          >
            <option value="">All Categories</option>
            <option value="suggestion">💡 Suggestions</option>
            <option value="issue">⚠️ Issues</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Feedback Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px",
        }}
      >
        {loading ? (
          <Loading message="Loading user feedback..." />
        ) : filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", fontFamily: "'Satoshi', sans-serif" }}>No feedback submitted yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#ffffff", textAlign: "left" }}>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>USER</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>ROLE</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>CATEGORY</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>MESSAGE</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f._id}>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <strong>{f.user?.name}</strong>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{f.user?.email}</div>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <span style={{ backgroundColor: "#f3f4f6", border: "1px solid #000", padding: "2px 6px", borderRadius: 2, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                        {f.user?.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <span
                        style={{
                          backgroundColor: f.type === "suggestion" ? "var(--color-kiwi, #abf139)" : "var(--color-primary, #ff3e33)",
                          color: f.type === "suggestion" ? "#000" : "#fff",
                          border: "1px solid #000",
                          padding: "2px 8px",
                          borderRadius: 2,
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {f.type === "suggestion" ? "💡 Suggestion" : "⚠️ Issue"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", maxWidth: "420px", fontWeight: 500 }}>
                      {f.message}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", whiteSpace: "nowrap" }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;