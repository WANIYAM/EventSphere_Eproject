import { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const ExhibitorExpos = () => {
  const { user } = useAuth();
  const [expos, setExpos] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedExpo, setSelectedExpo] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    products: ""
  });
  const [documents, setDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exposRes, appsRes] = await Promise.all([
        api.get("/expos"),
        api.get("/applications/my")
      ]);
      setExpos(exposRes.data);
      setMyApplications(appsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasApplied = (expoId) => {
    return myApplications.some((app) => (app.expo?._id || app.expo) === expoId);
  };

  const handleOpenApplyModal = (expo) => {
    setSelectedExpo(expo);
    setFormData({
      companyName: user?.company || "",
      products: ""
    });
    setDocuments([]);
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("Maximum 3 documents allowed");
      return;
    }
    setError("");
    setDocuments(files);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedExpo) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("expo", selectedExpo._id);
    data.append("companyName", formData.companyName);
    data.append("products", formData.products);

    documents.forEach((doc) => {
      data.append("documents", doc);
    });

    try {
      await api.post("/applications", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess(`Application submitted successfully for ${selectedExpo.title}!`);
      setSelectedExpo(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="exhibitor-page-container">
      <h2>Browse Upcoming Expos</h2>
      <p className="card-subtitle">Apply for booth space at upcoming exhibitions and events.</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p>Loading expos...</p>
      ) : expos.length === 0 ? (
        <p>No expos currently available.</p>
      ) : (
        <div className="expo-cards-grid">
          {expos.map((expo) => {
            const applied = hasApplied(expo._id);
            return (
              <div key={expo._id} className="expo-card">
                <h3>{expo.title}</h3>
                {expo.theme && <p className="expo-theme">{expo.theme}</p>}
                <div className="expo-meta">
                  <p>
                    <strong>Location:</strong> {expo.location || "TBA"}
                  </p>
                  <p>
                    <strong>Dates:</strong> {new Date(expo.startDate).toLocaleDateString()} -{" "}
                    {new Date(expo.endDate).toLocaleDateString()}
                  </p>
                </div>
                {expo.description && <p className="expo-desc">{expo.description}</p>}

                <div className="card-footer">
                  {applied ? (
                    <button className="btn btn-secondary" disabled>
                      Already Applied
                    </button>
                  ) : (
                    <button onClick={() => handleOpenApplyModal(expo)} className="btn btn-primary">
                      Apply for Booth
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Modal */}
      {selectedExpo && (
        <div className="modal-overlay" onClick={() => setSelectedExpo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for {selectedExpo.title}</h3>
              <button className="close-btn" onClick={() => setSelectedExpo(null)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="modal-body">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="form-group">
                <label>Products / Showcase Description</label>
                <textarea
                  rows="3"
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  placeholder="Describe the products or services you plan to exhibit"
                />
              </div>

              <div className="form-group">
                <label>Supporting Documents (Max 3: PDF, DOC, Images)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorExpos;
