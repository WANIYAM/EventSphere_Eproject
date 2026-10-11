import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminExpos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    location: "",
    startDate: "",
    endDate: "",
    boothCount: 20,
    boothPrice: 500,
    boothSize: "3x3 m",
  });

  const fetchExpos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expos");
      setExpos(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load expos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      theme: "",
      location: "",
      startDate: "",
      endDate: "",
      boothCount: 20,
      boothPrice: 500,
      boothSize: "3x3 m",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) return setError("Expo Title is required.");
    if (!formData.startDate) return setError("Start date is required.");
    if (!formData.endDate) return setError("End date is required.");
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return setError("End date cannot be before start date.");
    }

    try {
      if (editingId) {
        await api.put(`/expos/${editingId}`, formData);
        setSuccess("Expo updated successfully!");
      } else {
        await api.post("/expos", formData);
        setSuccess("Expo and interactive booths created successfully!");
      }
      resetForm();
      fetchExpos();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (expo) => {
    setEditingId(expo._id);
    setFormData({
      title: expo.title || "",
      description: expo.description || "",
      theme: expo.theme || "",
      location: expo.location || "",
      startDate: expo.startDate ? expo.startDate.split("T")[0] : "",
      endDate: expo.endDate ? expo.endDate.split("T")[0] : "",
      boothCount: 20,
      boothPrice: 500,
      boothSize: "3x3 m",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo? All related booths and applications will be deleted!")) {
      setError("");
      setSuccess("");
      try {
        await api.delete(`/expos/${id}`);
        setSuccess("Expo deleted successfully!");
        fetchExpos();
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to delete expo");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "10px 0" }}>
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
          <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
            [ EXPO CONFIGURATION ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            EXPO EVENT MANAGER
          </h1>
        </div>
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

      {/* Creator / Editor Form Card */}
      <div
        style={{
          backgroundColor: "var(--color-light, #fff8eb)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "28px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 20px 0" }}>
          {editingId ? "EDIT EXPO EVENT" : "+ CREATE NEW EXPO & AUTO-GENERATE BOOTHS"}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Expo Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Asia Tech Innovation Expo 2025"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Theme / Industry</label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              placeholder="e.g. AI & Robotics"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Convention Center / Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. KOMCA DPS 1, Penang"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          {!editingId && (
            <>
              <div>
                <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Booth Count</label>
                <input
                  type="number"
                  name="boothCount"
                  min="1"
                  value={formData.boothCount}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
                />
              </div>

              <div>
                <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Base Price ($)</label>
                <input
                  type="number"
                  name="boothPrice"
                  min="0"
                  value={formData.boothPrice}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
                />
              </div>
            </>
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Description & Guidelines</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Expo scope, exhibitor criteria, and attendee instructions"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "2px solid #000", boxShadow: "3px 3px 0px #000", padding: "12px 24px", fontFamily: "var(--font-display)", fontSize: 20, cursor: "pointer" }}
            >
              {editingId ? "Update Expo Event" : "Create Expo & Generate Booths →"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ backgroundColor: "#e5e7eb", color: "#000", border: "2px solid #000", padding: "12px 20px", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Expos Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 16px 0" }}>
          REGISTERED EXPO SCHEDULES ({expos.length})
        </h3>

        {loading ? (
          <Loading message="Loading expos..." />
        ) : expos.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", fontFamily: "'Satoshi', sans-serif" }}>No expos created yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#ffffff", textAlign: "left" }}>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>EXPO TITLE</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>DATES</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>LOCATION</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>OPERATIONS</th>
                </tr>
              </thead>
              <tbody>
                {expos.map((expo) => (
                  <tr key={expo._id} style={{ borderBottom: "1.5px solid #e5e7eb" }}>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <strong>{expo.title}</strong>
                      {expo.theme && <div style={{ fontSize: 12, color: "#6b7280" }}>{expo.theme}</div>}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 600 }}>
                      {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 600 }}>
                      {expo.location || "TBA"}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Link
                          to={`/admin/expos/${expo._id}/booths`}
                          style={{ backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, textDecoration: "none", fontSize: 12, fontWeight: 700 }}
                        >
                          Booths
                        </Link>
                        <Link
                          to={`/admin/expos/${expo._id}/sessions`}
                          style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, textDecoration: "none", fontSize: 12, fontWeight: 700 }}
                        >
                          Sessions
                        </Link>
                        <button
                          onClick={() => handleEdit(expo)}
                          style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expo._id)}
                          style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                        >
                          Delete
                        </button>
                      </div>
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

export default AdminExpos;