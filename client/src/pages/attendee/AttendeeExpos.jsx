import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
          api.get("/registrations/my")
        ]);
        setExpos(expoRes.data);
        setRegistrations(regRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check if already registered for an expo
  const isRegistered = (expoId) =>
    registrations.some((r) => r.type === "expo" && r.expo?._id === expoId && r.registered);

  const handleRegister = async (expoId) => {
    setError("");
    setSuccess("");
    try {
      await api.post("/registrations", { expo: expoId });
      setSuccess("Successfully registered for expo!");
      // Refresh registrations
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading expos...</p>;

  return (
    <div className="dashboard-container">
      <h2>Browse Expos</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {expos.length === 0 ? (
        <p className="text-muted">No expos available yet.</p>
      ) : (
        <div className="expo-cards-grid">
          {expos.map((expo) => (
            <div key={expo._id} className="expo-card">
              <h3>{expo.title}</h3>
              {expo.theme && <div className="expo-theme">{expo.theme}</div>}
              <div className="expo-meta">
                <p>📅 {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</p>
                <p>📍 {expo.location || "TBA"}</p>
              </div>
              {expo.description && (
                <p className="expo-desc">{expo.description.substring(0, 120)}...</p>
              )}
              <div className="card-footer" style={{ display: "flex", gap: "0.5rem" }}>
                <Link to={`/attendee/expos/${expo._id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
                {isRegistered(expo._id) ? (
                  <span className="badge badge-approved">✓ Registered</span>
                ) : (
                  <button
                    onClick={() => handleRegister(expo._id)}
                    className="btn btn-success btn-sm"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeExpos;
