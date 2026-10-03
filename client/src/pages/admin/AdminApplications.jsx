import { useState, useEffect } from "react";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/applications?status=${statusFilter}` : "/applications";
      const res = await api.get(url);
      setApplications(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setError("");
    setSuccess("");
    try {
      await api.put(`/applications/${id}/status`, { status: newStatus });
      setSuccess(`Application marked as ${newStatus}!`);
      fetchApplications();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || `Failed to update status to ${newStatus}`);
    }
  };

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
            [ EXHIBITOR APPROVALS ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            EXHIBITOR BOOTH APPLICATIONS
          </h1>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800 }}>Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, backgroundColor: "var(--color-light, #fff8eb)" }}
          >
            <option value="">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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

      {/* Applications Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px",
        }}
      >
        {loading ? (
          <Loading message="Loading applications..." />
        ) : applications.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>No applications found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#ffffff", textAlign: "left" }}>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>EXHIBITOR</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>COMPANY</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>TARGET EXPO</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>PRODUCTS & DOCS</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>STATUS</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>ASSIGNED BOOTH</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>DECISION</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <strong>{app.exhibitor?.name}</strong>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{app.exhibitor?.email}</div>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 700 }}>
                      {app.companyName || app.exhibitor?.company || "N/A"}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 600 }}>
                      {app.expo?.title || "N/A"}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <div>{app.products || "N/A"}</div>
                      {app.documents && app.documents.length > 0 && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                          {app.documents.map((docPath, idx) => (
                            <a
                              key={idx}
                              href={`http://localhost:5000${docPath}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "2px 6px", borderRadius: 2, fontSize: 10, textDecoration: "none", fontWeight: 800 }}
                            >
                              📄 Doc {idx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <span
                        style={{
                          backgroundColor:
                            app.status === "approved"
                              ? "var(--color-kiwi, #abf139)"
                              : app.status === "rejected"
                              ? "var(--color-primary, #ff3e33)"
                              : "var(--color-selective-yellow, #feb804)",
                          color: app.status === "rejected" ? "#fff" : "#000",
                          border: "1px solid #000",
                          padding: "2px 8px",
                          borderRadius: 2,
                          fontWeight: 800,
                          fontSize: 11,
                          textTransform: "uppercase",
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      {app.booth ? (
                        <span style={{ backgroundColor: "#000", color: "#fff", padding: "2px 6px", borderRadius: 2, fontWeight: 700, fontSize: 11 }}>
                          Booth {app.booth.boothNumber}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {app.status !== "approved" && (
                          <button
                            onClick={() => handleStatusUpdate(app._id, "approved")}
                            style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "1.5px solid #000", padding: "4px 8px", borderRadius: 3, cursor: "pointer", fontWeight: 800, fontSize: 11 }}
                          >
                            Approve
                          </button>
                        )}
                        {app.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "4px 8px", borderRadius: 3, cursor: "pointer", fontWeight: 800, fontSize: 11 }}
                          >
                            Reject
                          </button>
                        )}
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

export default AdminApplications;