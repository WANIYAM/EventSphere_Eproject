import { useState, useEffect } from "react";
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
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="exhibitor-page-container">
      <h2>My Expo Applications</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading your applications...</p>
      ) : applications.length === 0 ? (
        <p>You haven't submitted any applications yet.</p>
      ) : (
        <div className="app-cards-list">
          {applications.map((app) => (
            <div key={app._id} className="app-card">
              <div className="app-card-header">
                <h3>{app.expo?.title || "Unknown Expo"}</h3>
                <span className={`badge badge-${app.status}`}>{app.status}</span>
              </div>

              <div className="app-card-body">
                <p>
                  <strong>Company Name:</strong> {app.companyName || "N/A"}
                </p>
                <p>
                  <strong>Products / Services:</strong> {app.products || "N/A"}
                </p>

                {app.expo?.startDate && (
                  <p>
                    <strong>Expo Dates:</strong> {new Date(app.expo.startDate).toLocaleDateString()} -{" "}
                    {new Date(app.expo.endDate).toLocaleDateString()}
                  </p>
                )}

                {app.documents && app.documents.length > 0 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <strong>Uploaded Documents:</strong>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      {app.documents.map((docPath, idx) => (
                        <a
                          key={idx}
                          href={`http://localhost:5000${docPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-sm btn-info"
                        >
                          Document {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="assigned-booth-box" style={{ marginTop: "1rem" }}>
                  <strong>Assigned Booth:</strong>{" "}
                  {app.booth ? (
                    <span className="badge badge-booked">Booth {app.booth.boothNumber}</span>
                  ) : (
                    <span className="text-muted">Not assigned yet</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
